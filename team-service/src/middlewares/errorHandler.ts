import { NextFunction, Request, Response } from 'express';
import { AppError, isPgLikeError } from '../utils/errors';

const isDevelopmentMode = () => ['dev', 'development'].includes((process.env.NODE_ENV ?? '').toLowerCase());

const mapDatabaseError = (code: string | undefined): { status: number; message: string } => {
  switch (code) {
    case '23505':
      return { status: 409, message: 'Duplicate resource' };
    case '23503':
      return { status: 409, message: 'Referenced resource does not exist' };
    case '23502':
      return { status: 400, message: 'Missing required field' };
    case '22P02':
      return { status: 400, message: 'Invalid input format' };
    case '22001':
      return { status: 400, message: 'Input value too long' };
    default:
      return { status: 500, message: 'Database error' };
  }
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  void _next;
  const now = new Date().toISOString();
  const developmentMode = isDevelopmentMode();

  if (err instanceof AppError) {
    console.error(
      JSON.stringify({
        level: 'error',
        timestamp: now,
        route: `${req.method} ${req.originalUrl}`,
        statusCode: err.statusCode,
        message: err.message,
        ...(developmentMode ? { stack: err.stack } : {})
      })
    );

    res.status(err.statusCode).json({
      message: developmentMode || err.expose ? err.message : 'Internal server error',
      ...(developmentMode ? { stack: err.stack } : {})
    });
    return;
  }

  if (isPgLikeError(err)) {
    const mapped = mapDatabaseError(err.code);

    console.error(
      JSON.stringify({
        level: 'error',
        timestamp: now,
        route: `${req.method} ${req.originalUrl}`,
        statusCode: mapped.status,
        message: mapped.message,
        ...(developmentMode
          ? {
              dbCode: err.code,
              detail: err.detail,
              constraint: err.constraint,
              table: err.table,
              stack: err.stack
            }
          : {})
      })
    );

    res.status(mapped.status).json(
      developmentMode
        ? {
            message: mapped.message,
            dbCode: err.code,
            detail: err.detail,
            constraint: err.constraint,
            table: err.table
          }
        : { message: mapped.message }
    );
    return;
  }

  const fallbackError = err instanceof Error ? err : new Error('Unknown internal error');

  console.error(
    JSON.stringify({
      level: 'error',
      timestamp: now,
      route: `${req.method} ${req.originalUrl}`,
      statusCode: 500,
      message: fallbackError.message,
      ...(developmentMode ? { stack: fallbackError.stack } : {})
    })
  );

  res.status(500).json(
    developmentMode
      ? { message: fallbackError.message, stack: fallbackError.stack }
      : { message: 'Internal server error' }
  );
};
