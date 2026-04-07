export class AppError extends Error {
  public readonly statusCode: number;
  public readonly expose: boolean;

  constructor(message: string, statusCode = 500, expose = true) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.expose = expose;
  }
}

export type PgLikeError = Error & {
  code?: string;
  detail?: string;
  constraint?: string;
  table?: string;
};

export const isPgLikeError = (error: unknown): error is PgLikeError => {
  if (!error || typeof error !== 'object') {
    return false;
  }

  return 'code' in error;
};
