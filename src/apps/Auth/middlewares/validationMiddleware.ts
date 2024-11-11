import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { StatusCodes } from "http-status-codes";

export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors
          .map((issue: any) => `${issue.path.join(".")} is ${issue.message}`)
          .join("; ");
        res
          .status(400)
          .json({ status: 400, message: errorMessages });
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ status: 500, message: "Internal Server Error" });
      }
    }
  };
}
