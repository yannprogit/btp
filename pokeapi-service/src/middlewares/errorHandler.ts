import { ErrorRequestHandler, RequestHandler } from 'express';

const isDevelopmentMode = () => ['dev', 'development'].includes((process.env.NODE_ENV ?? '').toLowerCase());

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  const developmentMode = isDevelopmentMode();
  const errorMessage = err instanceof Error ? err.message : 'Unexpected error';

  console.error(
    JSON.stringify({
      level: 'error',
      timestamp: new Date().toISOString(),
      route: `${req.method} ${req.originalUrl}`,
      message: errorMessage,
      ...(developmentMode ? { stack: err instanceof Error ? err.stack : undefined } : {}),
    }),
  );

  res.status(500).json(
    developmentMode
      ? { message: errorMessage, stack: err instanceof Error ? err.stack : undefined }
      : { message: 'Internal server error' },
  );
};