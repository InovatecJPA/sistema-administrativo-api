export class BaseError extends Error {
  public status: number;
  public details?: any;

  constructor(message: string, status: number, details?: any) {
    super(message);
    this.status = status;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toResponse() {
    return {
      status: this.status,
      message: this.message,
      details: this.details,
    };
  }
}
