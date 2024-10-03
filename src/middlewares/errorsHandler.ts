import { Request, Response, NextFunction } from "express";
import { BaseError } from "../error/BaseError";

export const errorsHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Erro de sintaxe no JSON
  if (
    err instanceof SyntaxError &&
    (err as any).status === 400 &&
    "body" in err
  ) {
    console.error("Invalid JSON syntax error detected.");
    return res
      .status(400)
      .json({ status: 400, message: "Invalid JSON format." });
  }

  // Erros personalizados
  if (err instanceof BaseError) {
    console.error("Base error: ", err.message);
    return res.status(err.status).json({
      error: err.message,
    });
  }

  // Erro genérico
  console.error("Unexpected server error: ", err);
  res.status(500).json({
    status: 500,
    error: "Internal server error.",
  });
};
