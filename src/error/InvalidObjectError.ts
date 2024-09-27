import { BaseError } from "./BaseError";

export class InvalidObjectError extends BaseError {
  /**
   * Creates an instance of the InvalidObjectError class.
   *
   * @param {string} message - The error message.
   * @param {number} status - The HTTP status code associated with the error (default: 400).
   * @param {any} details - Optional additional details about the error.
   */
  constructor(message: string, status: number = 400, details?: any) {
    super(message, status, details);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
