import { Request, Response, NextFunction } from "express";

export default async function validateResponseMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");

  return next();
}
