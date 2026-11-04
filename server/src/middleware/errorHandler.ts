import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  const isDev = process.env.NODE_ENV === 'development';
  const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';

  // Safe logging without sensitive bodies or credentials
  console.error(`[Error Handler] ${req.method} ${req.path} - ${errorMessage}`);

  if (res.headersSent) {
    return;
  }

  res.status(500).json({
    success: false,
    error: isDev ? errorMessage : 'An unexpected error occurred. Please try again later.',
  });
}
