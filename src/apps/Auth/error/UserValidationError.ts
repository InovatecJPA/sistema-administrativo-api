export default class UserValidationError extends Error {
    public statusCode: number;
  
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
    }
  }