import { StatusCodes } from "http-status-codes";
import { BaseError } from "./BaseError";

export class UnauthorizedException extends BaseError {
  constructor(message: string) {
    super(message, 401);
  }
}
