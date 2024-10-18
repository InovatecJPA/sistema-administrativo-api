import { NextFunction, Request, Response } from "express";
import * as UserDTO from "../apps/Auth/dto/user.dto";
import Grant from "../apps/Auth/model/Grant";
import { grantService } from '../apps/Auth/service/GrantService';
import { profileService } from "../apps/Auth/service/ProfileService";
import * as jwt from "../config/jwt";
import { c } from "vite/dist/node/types.d-aGj9QkWt";

function checkRoutePermission(currentPath: string, userId: string, grantsWithUUID: Grant[]): boolean {

  // Regex pattern for UUIDs in routes 
  // UUID format xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx
  const uuidRegex: RegExp = /(\{)?[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}(\})?/;
  const uuidMatches: RegExpMatchArray = currentPath.match(uuidRegex);
  const uuid = uuidMatches ? uuidMatches[0] : null;

  // Generate a list of routes with UUIDs replaced if applicable
  const grants = grantsWithUUID.map((grant) => {
    const { route } = grant;
    return route.includes(":id") && uuid ? route.replace(":id", uuid) : route;
  });

  // Return true if the user has permission to access the route
  return grants.includes(currentPath);
};

function freeRoutes(currentPath: string): boolean {

  const defaultAllowedPaths = [
    "/v1/accounts/profiles/store",
    "/v1/accounts/users/profile",
    "/v1/accounts/users/changePassword",
    // `/users/${userId}`,
  ];

  if (defaultAllowedPaths.includes(currentPath)) return true;
}

// const filterRoute = (
//   userInfo: UserDTO.userInfo,
//   profileGrants: ProfileGrant[]
// ): void => {
//   // Regex pattern for UUIDs in routes
//   const uuidRegex =
//     /(\{)?[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}(\})?/;
//   const matches = userInfo.path.match(uuidRegex);
//   const uuid = matches ? matches[0] : null;

//   // Map grants to routes, replacing UUID if applicable
//   const grants = profileGrants.map((profileGrant) => {
//     const { route } = profileGrant.grant;
//     return route.includes(":id") && uuid ? route.replace(":id", uuid) : route;
//   });

//   // Find the index of the user's path in the list of permitted routes
//   const index = grants.indexOf(userInfo.path);

//   // If the route is not found, no filtering is done
//   if (index === -1) return;

//   // Map and set the route filter based on the index
//   const filterableRoutes = profileGrants.map(
//     (profileGrant) => profileGrant.grant.routeFilter
//   );

//   userInfo.routeFilter = filterableRoutes[index];
// };

// currentPath, user, userProfile, userGrants, profiles, grants,


export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  // If the route is free, proceed to the next middleware or route handler
  if (freeRoutes(req.originalUrl)) {
    return next();
  }

  // Retrieve the authorization header from the request
  const authHeader = req.headers.authorization;

  // Check if the authorization header is present
  if (!authHeader) {
    return res.status(401).json({ error: "Token not provided." });
  }

  // Split the authorization header into scheme and token
  const parts = authHeader.split(" ");

  // Validate the authorization header format
  if (parts.length !== 2) {
    return res.status(401).json({ error: "Token error." });
  }

  const [scheme, token] = parts;

  // Check if the authorization scheme is 'Bearer'
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: "Token poorly formatted." });
  }

  // Verify the JWT token and extract user information
  const userInfo = jwt.verifyToken(token);

  // If the token is invalid, return an error response
  if (!userInfo) {
    return res.status(401).json({ error: "Token invalid." });
  }

  // Assign the user information to the request object
  req.userInfo = userInfo as UserDTO.userInfo;

  // Extract the base path from the request URL (excluding query parameters)
  const startParams = req.originalUrl.indexOf("?");
  req.userInfo.path = req.originalUrl.substring(
    0,
    startParams === -1 ? req.originalUrl.length : startParams
  );

  // Retrieve profile grants from the database
  const grantsWithUUID: Grant[] = await grantService.findAllByAssociatedProfile(userInfo.profile_id);
  console.log(userInfo)
  console.log("grantsWithUUID: ", grantsWithUUID);

  // If the user has the Admin profile
  userInfo.profile = await profileService.findOneById(userInfo.profile_id);
  userInfo.isAdmin = userInfo.profile.name === "admin" ? true : false;

  // Check if the user has permission to access the route
  if (!userInfo.isAdmin && !checkRoutePermission(req.userInfo.path, req.userInfo.id, grantsWithUUID)) {
    return res.status(403).json({ error: "Access denied" });
    
  } else {
    try {
      // Filter and set the route filter if applicable
      // filterRoute(req.userInfo, profileGrants);
      return next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: "Bad request" });
    }
  }
};
