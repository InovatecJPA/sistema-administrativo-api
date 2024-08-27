import * as jwt from "../config/jwt";
import Grant from "../apps/Auth/model/Grant";
import ProfileGrant from "../apps/Auth/model/ProfileGrant";
import { NextFunction, Request, Response } from "express";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token not provided" });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    return res.status(401).json({ error: "Token error" });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: "Token malformatted" });
  }

  const userInfo = jwt.verifyToken(token);

  if (!userInfo) {
    return res.status(401).json({ error: "Token invalid" });
  }

  console.log(req.query);

  req.userInfo = userInfo;

  const startParams = req.originalUrl.indexOf("?");
  req.userInfo.path = req.originalUrl.substring(0, startParams === -1 ? req.originalUrl.length : startParams);

  console.log(userInfo)
};
