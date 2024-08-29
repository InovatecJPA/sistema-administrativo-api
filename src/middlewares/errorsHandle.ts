import { Request, Response, NextFunction } from "express";

class CustomError extends Error {
    public statusCode: number;
    
    constructor(message: string) {
      super(message);
      this.name = 'CustomError';
    }
  }
  

export default async function(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(err.stack);

    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({ error: err.message });
    }

    // Generic server error
    return res.status(500).json({ error: "Internal Server Error" });
} 