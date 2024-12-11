export interface ErrorDetails {
  code?: number;
  message: string;
  status?: string;
  details?: string;
}

export class AppError extends Error {
  code?: number;
  status?: string;
  details?: string;

  constructor(error: Error | ErrorDetails) {
    super(typeof error === 'string' ? error : error.message);
    
    if ('code' in error) this.code = error.code;
    if ('status' in error) this.status = error.status;
    if ('details' in error) this.details = error.details;
    
    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  toString(): string {
    return this.message;
  }

  toObject(): ErrorDetails {
    return {
      code: this.code,
      message: this.message,
      status: this.status,
      details: this.details,
    };
  }
}

export const handleError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error);
  }

  if (typeof error === 'object' && error !== null) {
    const errorObj = error as any;
    return new AppError({
      message: errorObj.message || 'An unknown error occurred',
      code: errorObj.code || errorObj.status,
      status: errorObj.status,
      details: errorObj.details || errorObj.error?.message,
    });
  }

  return new AppError({
    message: String(error),
  });
};