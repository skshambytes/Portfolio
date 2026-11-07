import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import compression from 'compression';
import morgan from 'morgan';
import { resolve } from 'node:path';
import { ENV } from './config/env.js';
import { connectDB, isDatabaseConnected } from './db/connection.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import projectsRouter from './routes/projects.js';
import contactRouter from './routes/contact.js';

const app = express();

// Trust reverse proxy for accurate client IP detection behind Render, Railway, etc.
app.set('trust proxy', 1);

// Disable X-Powered-By
app.disable('x-powered-by');

// Strict Security Headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'https://challenges.cloudflare.com'],
        frameSrc: ["'self'", 'https://challenges.cloudflare.com'],
        connectSrc: ["'self'", 'https://api.github.com', 'https://challenges.cloudflare.com'],
        imgSrc: ["'self'", 'data:', 'https://raw.githubusercontent.com', 'https://github.com'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: ENV.NODE_ENV === 'production' ? [] : null,
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
);

// Compression
app.use(compression());

// Request logging (sanitized, no sensitive bodies or auth tokens)
morgan.token('clean-url', (req) => req.url?.split('?')[0]);
app.use(
  morgan(':method :clean-url :status :res[content-length] - :response-time ms', {
    skip: (req) => req.url === '/api/health',
  })
);

// CORS Allowlist
const allowedOrigins = ENV.CLIENT_ORIGIN.split(',').map((o) => o.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      // In development or server-to-server calls with no origin header, allow
      if (!origin || ENV.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      return callback(new Error('Cross-Origin Request Blocked by Policy'));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
    maxAge: 86400, // 24 hours preflight cache
  })
);

// Limit JSON payload size to 10kb to avoid DoS
app.use(express.json({ limit: '10kb' }));

// Prevent NoSQL Injection by sanitizing inputs ($ and . operators)
app.use(
  mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ key }) => {
      console.warn(`[Security Alert] Sanitized suspicious key in payload: ${key}`);
    },
  })
);

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Apply global rate limiting to all /api routes
app.use('/api', globalLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: isDatabaseConnected() ? 'connected' : 'standby',
    version: '1.0.0',
  });
});

// Mount Routes
app.use('/api/projects', projectsRouter);
app.use('/api/contact', contactRouter);

// 404 Handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
  });
});

// Central Error Handler
app.use(errorHandler);

// Start server
async function startServer() {
  await connectDB();

  const server = app.listen(ENV.PORT, () => {
    console.log(`[Server] Portfolio backend running on port ${ENV.PORT} [${ENV.NODE_ENV}]`);
  });

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.error(
        `[Server Error] Port ${ENV.PORT} is already in use. If the portfolio backend is already running, keep using it and start only the client. Otherwise stop the process using this port or set PORT to an available port in server/.env.`
      );
    } else {
      console.error('[Server Error] Failed to start the HTTP server:', err);
    }
    process.exit(1);
  });

  const shutdown = async (signal: string) => {
    console.log(`\n[Server] Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log('[Server] HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(__filename)) {
  startServer().catch((err) => {
    console.error('[Server Fatal] Failed to bootstrap server:', err);
    process.exit(1);
  });
}

export default app;
