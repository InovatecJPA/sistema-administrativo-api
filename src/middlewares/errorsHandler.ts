import { Request, Response, NextFunction } from "express";
import { BaseError } from "../error/BaseError";

export const errorsHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof SyntaxError && "body" in err) {
    console.log("JSON inválido");
    console.log(req);
    console.log("req.body", req.body);

    return res
      .status(400)
      .json({ status: 400, message: "Invalid JSON format" });
  }

  if (err instanceof BaseError) {
    console.log("BASE ERROR ", err.message);
    console.log(req);
    console.log("req.body", req.body);

    return res.status(err.status).json({
      error: err.message,
    });
  }

  console.log("Erro inesperado: ", err);
  res.status(500).json({
    status: 500,
    error: "Erro interno do servidor",
  });
};
