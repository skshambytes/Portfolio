import dotenv from 'dotenv';
import path from 'path';

// Load .env if present
dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL || 'rajsaksham744@gmail.com',
  CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL || '"Saksham Raj Portfolio" <rajsaksham744@gmail.com>',
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY || '',
  IP_HASH_SALT: process.env.IP_HASH_SALT || 'fallback-dev-salt-change-in-production-min-32-chars-long',
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
};
