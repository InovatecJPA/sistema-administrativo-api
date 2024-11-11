import { NextFunction, Request, Response } from "express";
import * as UserDTO from "../apps/Auth/dto/user.dto";
import Grant from "../apps/Auth/model/Grant";
import { grantService } from "../apps/Auth/service/GrantService";
import { profileService } from "../apps/Auth/service/ProfileService";
import * as jwt from "../config/jwt";

function freeRoutes(currentPath: string): boolean {
  const defaultAllowedPaths = [
    "/v1/accounts/changePassword",
    "/v1/user/",
    "/v1/accounts/profiles/store",
    "/v1/accounts/users/profile",
    // `/users/${userId}`,
  ];

  if (defaultAllowedPaths.includes(currentPath)) return true;
}

function checkRoutePermission(
  currentPath: string,
  requestMethod: String,
  userId: string,
  grantsWithUUID: Grant[]
): boolean {
  // Regex pattern for UUIDs in routes
  // UUID format xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx
  const uuidRegex: RegExp =
    /(\{)?[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}(\})?/;
  const uuidMatches: RegExpMatchArray = currentPath.match(uuidRegex);
  const uuid = uuidMatches ? uuidMatches[0] : null;

  // Generate a list of routes with UUIDs replaced if applicable
  const grants = grantsWithUUID.map((grant) => {
    const { route, method } = grant;
    if (method.toLocaleUpperCase() !== requestMethod) return false;

    return route.includes(":id") && uuid ? route.replace(":id", uuid) : route;
  });

  // Return true if the user has permission to access the route
  return grants.includes(currentPath);
}

const checkToken = (authHeader: string) => {
  if (!authHeader) {
    throw new Error("Token not provided.");
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2) {
    throw new Error("Token error.");
  }

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) {
    throw new Error("Token poorly formatted.");
  }

  const userInfo = jwt.verifyToken(token);
  if (!userInfo) {
    throw new Error("Token invalid.");
  }

  return userInfo;
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const userInfo = checkToken(authHeader);
    req.userInfo = userInfo as UserDTO.userInfo;
    const startParams = req.originalUrl.indexOf("?");
    req.userInfo.path = req.originalUrl.substring(
      0,
      startParams === -1 ? req.originalUrl.length : startParams
    );

    const grantsByProfileWithUUID: Grant[] =
      await grantService.findAllByAssociatedProfile(userInfo.profile_id);
    const grantsBySectorWithUUID: Grant[] =
      await grantService.findAllByAssociatedSector(userInfo.profile_id);

    const grantsMap = new Map<string, Grant>();

    grantsByProfileWithUUID.forEach((grant) => {
      grantsMap.set(grant.id, grant);
    });

    grantsBySectorWithUUID.forEach((grant) => {
      grantsMap.set(grant.id, grant);
    });

    const uniqueGrantsWithUUID: Grant[] = Array.from(grantsMap.values());

    userInfo.profile = await profileService.findOneById(userInfo.profile_id);
    userInfo.isAdmin = userInfo.profile.name === "admin";

    // Tem que ficar aqui para esperar o UserInfo ser construído
    if (freeRoutes(req.originalUrl)) return next();

    if (
      !userInfo.isAdmin &&
      !checkRoutePermission(
        req.userInfo.path,
        req.method,
        req.userInfo.id,
        uniqueGrantsWithUUID
      )
    ) {
      return res.status(403).json({ status: 403, error: "Access denied" });
    }

    return next();
  } catch (error) {
    const statusCode =
      error.message === "Token not provided." ||
      error.message === "Token error." ||
      error.message === "Token poorly formatted." ||
      error.message === "Token invalid."
        ? 401
        : 400;
    return res
      .status(statusCode)
      .json({ status: statusCode, error: error.message });
  }
};
