/**
 * @description Base class for custom API errors.
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  /**
   * @param {number} statusCode - HTTP status code.
   * @param {string} message - Error message.
   * @param {boolean} isOperational - Indicates if the error is operational (expected) or a bug.
   */
  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype); // Restore prototype chain
    Error.captureStackTrace(this, this.constructor); // Maintain stack trace
  }
}

/**
 * @description Represents a 400 Bad Request error.
 */
export class BadRequestError extends ApiError {
  constructor(message = "Bad Request") {
    super(400, message);
  }
}

/**
 * @description Represents a 401 Unauthorized error.
 */
export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized") {
    super(401, message);
  }
}

/**
 * @description Represents a 403 Forbidden error.
 */
export class ForbiddenError extends ApiError {
  constructor(message = "Forbidden") {
    super(403, message);
  }
}

/**
 * @description Represents a 404 Not Found error.
 */
export class NotFoundError extends ApiError {
  constructor(message = "Not Found") {
    super(404, message);
  }
}

/**
 * @description Represents a 409 Conflict error.
 */
export class ConflictError extends ApiError {
  constructor(message = "Conflict") {
    super(409, message);
  }
}

/**
 * @description Represents a 500 Internal Server Error.
 */
export class InternalServerError extends ApiError {
  constructor(message = "Internal Server Error") {
    super(500, message, false); // Typically non-operational
  }
}
