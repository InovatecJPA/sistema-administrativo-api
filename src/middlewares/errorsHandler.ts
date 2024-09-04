import { Request, Response, NextFunction } from "express";
import { BaseError } from "../error/BaseError";

export const errorsHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof SyntaxError && "body" in err) {
    console.log("Invalid JSON");
    console.log(req);
    console.log("req.body", req.body);

    return res
      .status(400)
      .json({ status: 400, message: "Invalid JSON format." });
  }

  if (err instanceof BaseError) {
    console.log("Base error: ", err.message);
    console.log(req);
    console.log("req.body", req.body);

    return res.status(err.status).json({
      error: err.message,
    });
  }

  console.log("Unexpected server error: ", err);
  res.status(500).json({
    status: 500,
    error: "Internal server error.",
  });
};
