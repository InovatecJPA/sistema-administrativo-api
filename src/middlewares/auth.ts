import { NextFunction, Request, Response } from "express";
import * as UserDTO from "../apps/Auth/dto/user.dto";
import Grant from "../apps/Auth/model/Grant";
import Profile from "../apps/Auth/model/Profile";
import ProfileGrant from "../apps/Auth/model/ProfileGrant";
import { grantService } from "../apps/Auth/service/GrantService";
import { profileService } from "../apps/Auth/service/ProfileService";
import * as jwt from "../config/jwt";
import AppDataSource from "../database/dbConnection";

/**
 * Checks if the user has permission to access a specific route based on their profile grants.
 * @param userInfo - The user information including the requested path.
 * @param profileGrants - The list of profile grants associated with the user's profile.
 * @returns `true` if the user has permission to access the route, otherwise `false`.
 */
const checkRoutePermission = (
  userInfo: UserDTO.userInfo,
  profileGrants: ProfileGrant[]
) => {
  console.log(userInfo.path);
  // Verifica se o caminho atual é permitido por padrão
  const defaultAllowedPaths = [
    "/dev/accounts/users/profile",
    "/dev/accounts/users/changePassword",
    `/users/${userInfo.id}`,
  ];

  // If the user's path is in the default allowed paths, grant access
  if (defaultAllowedPaths.includes(userInfo.path)) return true;

  // Define regex patterns for routes that are allowed by default
  const regexPatterns = [
    /\/[a-zA-Z]+\/upload\//,
    /^\/upload\/get\//,
    /\/[a-zA-Z]+\/cpf\//,
  ];

  // Check if the user's path matches any of the regex patterns
  if (regexPatterns.some((regex) => regex.test(userInfo.path))) return true;

  // Regex pattern for UUIDs in routes
  const uuidRegex =
    /(\{)?[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}(\})?/;
  const uuidMatches = userInfo.path.match(uuidRegex);
  const uuid = uuidMatches ? uuidMatches[0] : null;

  // Generate a list of routes with UUIDs replaced if applicable
  const grants = profileGrants.map((profileGrant) => {
    const { route } = profileGrant.grant;
    return route.includes(":id") && uuid ? route.replace(":id", uuid) : route;
  });

  // Check if the user's path is in the list of permitted routes
  return grants.includes(userInfo.path);
};

/**
 * Filters and sets the route filter based on the profile grants.
 * @param userInfo - The user information including the requested path.
 * @param profileGrants - The list of profile grants associated with the user's profile.
 */
const filterRoute = (
  userInfo: UserDTO.userInfo,
  profileGrants: ProfileGrant[]
): void => {
  // Regex pattern for UUIDs in routes
  const uuidRegex =
    /(\{)?[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}(\})?/;
  const matches = userInfo.path.match(uuidRegex);
  const uuid = matches ? matches[0] : null;

  // Map grants to routes, replacing UUID if applicable
  const grants = profileGrants.map((profileGrant) => {
    const { route } = profileGrant.grant;
    return route.includes(":id") && uuid ? route.replace(":id", uuid) : route;
  });

  // Find the index of the user's path in the list of permitted routes
  const index = grants.indexOf(userInfo.path);

  // If the route is not found, no filtering is done
  if (index === -1) return;

  // Map and set the route filter based on the index
  const filterableRoutes = profileGrants.map(
    (profileGrant) => profileGrant.grant.routeFilter
  );

  userInfo.routeFilter = filterableRoutes[index];
};

// currentPath, user, userProfile, userGrants, profiles, grants,
const checkoutUserGrants = (userInfo: UserDTO.userInfo) => {
  const currentPath: string = userInfo.path;
  const userProfileId: string = userInfo.profile_id;
  const userGrants: Grant[] = userInfo.grants;
  const profiles: Profile[] = [];
  profileService.findAll().then((profiles: Profile[]) => {
    profiles.push();
  });

  const grants: Grant[] = [];
  grantService.findAll().then((grants: Grant[]) => {
    grants.push();
  });

  const userProfile: Profile = profiles.find(
    (profile) => profile.id === userProfileId
  );

  const profileGrants: Grant[] = grants.filter((grant) =>
    grant.associatedProfiles.some((profile) => profile === userProfile)
  );

  profileGrants.forEach((element) => {
    console.log(element);
  });
};

/**
 * Middleware function to handle authentication and authorization.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function.
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
  const profileGrantRepository = AppDataSource.getRepository(ProfileGrant);

  const profileGrants = await profileGrantRepository.find({
    where: { profile: { id: userInfo.profileId } }, // Filter grants by the user's profile ID
    relations: ["grant"], // Include the related Grant entity
    select: {
      grant: {
        route: true,
        routeFilter: true,
      },
    },
  });

  // Check if the user has permission to access the route
  if (!userInfo.isAdmin && !checkRoutePermission(req.userInfo, profileGrants)) {
    return res.status(403).json({ error: "Access denied" });
  } else {
    try {
      // Filter and set the route filter if applicable
      filterRoute(req.userInfo, profileGrants);
      return next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: "Bad request" });
    }
  }
};
