import { StatusCodes } from "http-status-codes";
import { BaseError } from "./BaseError";

export class AlreadyExistsError extends BaseError {
  constructor(message: string) {
    super(message, 409);
  }
}
