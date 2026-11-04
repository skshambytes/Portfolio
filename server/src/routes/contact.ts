import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Contact } from '../models/Contact.js';
import { contactFormLimiter } from '../middleware/rateLimiter.js';
import {
  hashIp,
  stripControlCharacters,
  hasCarriageReturnOrNewline,
  verifyTurnstile,
} from '../utils/security.js';
import { sendContactEmails } from '../services/email.js';
import { ENV } from '../config/env.js';

const router = Router();

// In-memory rate limiting per email address (max 5 per hour)
const emailSubmissionTracker = new Map<string, { count: number; firstSeen: number }>();

function checkEmailRateLimit(email: string): boolean {
  const now = Date.now();
  const normalized = email.toLowerCase().trim();
  const entry = emailSubmissionTracker.get(normalized);

  if (!entry || now - entry.firstSeen > 60 * 60 * 1000) {
    emailSubmissionTracker.set(normalized, { count: 1, firstSeen: now });
    return true;
  }

  if (entry.count >= 5) {
    return false;
  }

  entry.count += 1;
  return true;
}

// Zod validation schema
const ContactSchema = z.object({
  name: z
    .string()
    .min(1, 'Name cannot be empty')
    .max(100, 'Name must not exceed 100 characters'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email is too long'),
  subject: z
    .string()
    .min(1, 'Subject cannot be empty')
    .max(150, 'Subject must not exceed 150 characters'),
  message: z
    .string()
    .min(5, 'Message must be at least 5 characters')
    .max(3000, 'Message must not exceed 3000 characters'),
  consent: z
    .boolean()
    .refine((val) => val === true, { message: 'You must consent to be contacted' }),
  honeypot: z.string().optional(),
  renderedAt: z.number().optional(),
  turnstileToken: z.string().optional(),
});

router.post('/', contactFormLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Content-Type check
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(415).json({
        success: false,
        error: 'Unsupported media type. JSON body required.',
      });
    }

    // 2. Validate Origin Header against CLIENT_ORIGIN if provided
    const origin = req.headers['origin'];
    if (origin && ENV.NODE_ENV === 'production') {
      const allowed = ENV.CLIENT_ORIGIN.split(',').map((o) => o.trim().toLowerCase());
      if (!allowed.includes(origin.toLowerCase())) {
        return res.status(403).json({
          success: false,
          error: 'Cross-origin request rejected.',
        });
      }
    }

    // 3. Parse and validate with Zod
    const parseResult = ContactSchema.safeParse(req.body);
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0]?.message || 'Invalid input data';
      return res.status(400).json({
        success: false,
        error: firstIssue,
      });
    }

    const { name, email, subject, message, honeypot, renderedAt, turnstileToken } = parseResult.data;

    // 4. Honeypot check (hidden field bots fill out)
    if (honeypot && honeypot.trim().length > 0) {
      // Silently accept without processing to fool automated scrapers
      return res.status(200).json({
        success: true,
        message: 'Your message has been received.',
      });
    }

    // 5. Minimum time-to-submit check (bots submit instantaneously in < 1.5 seconds)
    if (renderedAt && typeof renderedAt === 'number') {
      const timeElapsed = Date.now() - renderedAt;
      if (timeElapsed < 1500) {
        return res.status(400).json({
          success: false,
          error: 'Submission was too fast. Please take your time.',
        });
      }
    }

    // 6. Email Header Injection Prevention (CRLF check)
    if (
      hasCarriageReturnOrNewline(name) ||
      hasCarriageReturnOrNewline(email) ||
      hasCarriageReturnOrNewline(subject)
    ) {
      return res.status(400).json({
        success: false,
        error: 'Invalid characters detected in form fields.',
      });
    }

    // 7. Strip control characters
    const cleanName = stripControlCharacters(name).trim();
    const cleanEmail = stripControlCharacters(email).trim().toLowerCase();
    const cleanSubject = stripControlCharacters(subject).trim();
    const cleanMessage = stripControlCharacters(message).trim();

    if (!cleanName || !cleanSubject || !cleanMessage) {
      return res.status(400).json({
        success: false,
        error: 'Form fields cannot consist solely of control characters.',
      });
    }

    // 8. Per-email rate limit check
    if (!checkEmailRateLimit(cleanEmail)) {
      return res.status(429).json({
        success: false,
        error: 'Too many submissions for this email address. Please try again later.',
      });
    }

    // 9. Client IP extraction and HMAC hashing
    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      'unknown';
    const anonymizedIpHash = hashIp(clientIp);

    // 10. Bot protection: Cloudflare Turnstile token verification
    const turnstileResult = await verifyTurnstile(turnstileToken, clientIp);
    if (!turnstileResult.success) {
      return res.status(400).json({
        success: false,
        error: turnstileResult.message || 'Bot verification failed. Please refresh and try again.',
      });
    }

    // 11. Save message to MongoDB
    try {
      await Contact.create({
        name: cleanName,
        email: cleanEmail,
        subject: cleanSubject,
        message: cleanMessage,
        ipHash: anonymizedIpHash,
      });
    } catch (dbErr) {
      console.warn('[Contact Save Warning] Database store error:', dbErr instanceof Error ? dbErr.message : String(dbErr));
      // Continue to try email notification even if DB is in degraded mode
    }

    // 12. Send Email notifications (to Saksham and auto-reply to sender)
    await sendContactEmails({
      name: cleanName,
      email: cleanEmail,
      subject: cleanSubject,
      message: cleanMessage,
    });

    return res.status(200).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully. I will get back to you soon.',
    });
  } catch (err) {
    next(err);
  }
});

export default router;
