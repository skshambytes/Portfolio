import nodemailer from 'nodemailer';
import type { Transporter, SendMailOptions } from 'nodemailer';
import { ENV } from '../config/env.js';
import { escapeHtml } from '../utils/security.js';

let transporter: Transporter | null = null;

// Daily auto-reply tracker per email address to prevent backscatter / abuse
const dailyAutoReplies = new Map<string, { count: number; date: string }>();

function canSendAutoReply(email: string): boolean {
  const today = new Date().toISOString().slice(0, 10);
  const normalizedEmail = email.toLowerCase().trim();
  const entry = dailyAutoReplies.get(normalizedEmail);

  if (!entry || entry.date !== today) {
    dailyAutoReplies.set(normalizedEmail, { count: 1, date: today });
    return true;
  }

  if (entry.count < 2) {
    entry.count += 1;
    return true;
  }

  return false;
}

function getTransporter(): Transporter {
  if (!transporter) {
    if (ENV.SMTP_HOST && ENV.SMTP_USER && ENV.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: ENV.SMTP_HOST,
        port: ENV.SMTP_PORT,
        secure: ENV.SMTP_PORT === 465,
        auth: {
          user: ENV.SMTP_USER,
          pass: ENV.SMTP_PASS,
        },
      });
    } else {
      // In dev or test mode when SMTP is not configured, create a stream or test transporter
      transporter = nodemailer.createTransport({
        jsonTransport: true,
      });
    }
  }
  return transporter;
}

export interface ContactEmailPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactEmails(payload: ContactEmailPayload): Promise<{ delivered: boolean }> {
  const mailer = getTransporter();

  const safeName = escapeHtml(payload.name);
  const safeEmail = escapeHtml(payload.email);
  const safeSubject = escapeHtml(payload.subject);
  const safeMessage = escapeHtml(payload.message).replace(/\n/g, '<br/>');

  // 1. Email notification to Saksham Raj
  const ownerMailOptions: SendMailOptions = {
    from: ENV.CONTACT_FROM_EMAIL,
    to: ENV.CONTACT_TO_EMAIL,
    replyTo: payload.email,
    subject: `[Portfolio Inquiry] ${payload.subject}`,
    text: `New message from portfolio contact form:\n\nName: ${payload.name}\nEmail: ${payload.email}\nSubject: ${payload.subject}\n\nMessage:\n${payload.message}\n`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0ea5e9; margin-top: 0;">New Contact Form Message</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
        <p><strong>Subject:</strong> ${safeSubject}</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <h3 style="color: #334155;">Message:</h3>
        <p style="white-space: pre-wrap; background: #f8fafc; padding: 16px; border-radius: 6px; color: #1e293b;">${safeMessage}</p>
      </div>
    `,
  };

  try {
    await mailer.sendMail(ownerMailOptions);
    console.log('[Email] Owner notification processed successfully.');
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown mail error';
    console.error(`[Email Warning] Failed to send owner email: ${errorMsg}`);
    // We do not fail the request if saving to DB succeeded
  }

  // 2. Auto-reply confirmation to the sender (capped per day)
  if (canSendAutoReply(payload.email)) {
    const confirmationMailOptions: SendMailOptions = {
      from: ENV.CONTACT_FROM_EMAIL,
      to: payload.email,
      subject: `Thank you for reaching out, ${payload.name} | Saksham Raj`,
      text: `Hi ${payload.name},\n\nThank you for reaching out! I have received your message regarding "${payload.subject}". I will review your inquiry and get back to you shortly.\n\nBest regards,\nSaksham Raj\nData Analyst | Business Intelligence\nhttps://github.com/skshambytes\nrajsaksham744@gmail.com\n`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; color: #334155;">
          <h2 style="color: #0ea5e9; margin-top: 0;">Thank you for getting in touch!</h2>
          <p>Hi <strong>${safeName}</strong>,</p>
          <p>I have received your message regarding <em>"${safeSubject}"</em> and will review it and get back to you as soon as possible.</p>
          <div style="margin: 24px 0; padding: 16px; background: #f8fafc; border-left: 4px solid #0ea5e9; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px; color: #64748b;"><strong>Your message excerpt:</strong></p>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #334155;">${safeMessage}</p>
          </div>
          <p>Best regards,</p>
          <p style="margin-bottom: 0;"><strong>Saksham Raj</strong><br/>
          <span style="color: #64748b;">Data Analyst | Business Intelligence</span><br/>
          <a href="mailto:rajsaksham744@gmail.com" style="color: #0ea5e9;">rajsaksham744@gmail.com</a> | +91 9625631438
          </p>
        </div>
      `,
    };

    try {
      await mailer.sendMail(confirmationMailOptions);
      console.log('[Email] Auto-reply confirmation sent.');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown mail error';
      console.error(`[Email Warning] Auto-reply failed: ${errorMsg}`);
    }
  }

  return { delivered: true };
}
