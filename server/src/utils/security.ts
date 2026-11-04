import crypto from 'crypto';
import { ENV } from '../config/env.js';

/**
 * Creates an HMAC-SHA256 hash of the client's IP using a secret salt.
 * Ensures the raw IP address is never stored in plaintext.
 */
export function hashIp(ip: string): string {
  const normalizedIp = ip.trim().toLowerCase();
  return crypto
    .createHmac('sha256', ENV.IP_HASH_SALT)
    .update(normalizedIp)
    .digest('hex');
}

/**
 * Strips ASCII control characters (0x00 - 0x1F except tabs/newlines, and 0x7F)
 */
export function stripControlCharacters(str: string): string {
  // Disallow ASCII control characters
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

/**
 * Verifies that a single-line field does not contain Carriage Return or Line Feed
 * characters (prevents SMTP header injection / CRLF injection).
 */
export function hasCarriageReturnOrNewline(str: string): boolean {
  return /[\r\n]/.test(str);
}

/**
 * Basic HTML escaping for dynamic content inserted into email templates.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Verifies Cloudflare Turnstile token server-side.
 * If secret key is not provided or dev dummy key is used, skips verification gracefully.
 */
export async function verifyTurnstile(
  token: string | undefined,
  remoteIp?: string
): Promise<{ success: boolean; message?: string }> {
  // If no Turnstile key is configured or running in development without key, allow
  if (!ENV.TURNSTILE_SECRET_KEY || ENV.TURNSTILE_SECRET_KEY === '1x0000000000000000000000000000000AA') {
    return { success: true };
  }

  if (!token) {
    return { success: false, message: 'Turnstile verification token missing' };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', ENV.TURNSTILE_SECRET_KEY);
    formData.append('response', token);
    if (remoteIp) {
      formData.append('remoteip', remoteIp);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return { success: false, message: 'Turnstile verification service unreachable' };
    }

    const outcome = (await response.json()) as { success: boolean; 'error-codes'?: string[] };
    return {
      success: outcome.success === true,
      message: outcome.success ? undefined : 'Bot verification failed',
    };
  } catch (err) {
    console.warn('[Security] Turnstile verification exception:', err instanceof Error ? err.message : String(err));
    // Fail secure in production if verification fails
    return { success: false, message: 'Bot verification error' };
  }
}
