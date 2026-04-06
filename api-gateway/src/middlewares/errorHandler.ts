import { ErrorRequestHandler, RequestHandler } from 'express';

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  console.error(
    JSON.stringify({
      level: 'error',
      timestamp: new Date().toISOString(),
      route: `${req.method} ${req.originalUrl}`,
      message: err?.message ?? 'Unexpected error',
      stack: err?.stack,
    }),
  );

  res.status(500).json({ message: 'Internal server error' });
};