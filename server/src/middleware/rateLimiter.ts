import rateLimit from 'express-rate-limit';

// Global API rate limiter: max 100 requests per 15 minutes per IP
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests. Please try again later.',
  },
});

// Contact form limiter: max 5 submissions per 1 hour per IP
export const contactFormLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Submission limit reached. Please wait before sending another message or contact directly via email.',
  },
});
