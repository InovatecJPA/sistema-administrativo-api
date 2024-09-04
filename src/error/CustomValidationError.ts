import { BaseError } from "./BaseError";

export class CustomValidationError extends BaseError {
  public statusCode: number;

  constructor(message: string) {
    super(message, 400);
  }
}
