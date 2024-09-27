/**
 * Interface representing the information of a user in the system.
 */
export interface userInfo {
  /**
   * The name of the user.
   * This field is optional.
   * @type {string}
   */
  name?: string;

  /**
   * The unique identifier for the user.
   * @type {string}
   */
  id: string;

  /**
   * The email address of the user.
   * @type {string}
   */
  email: string;

  /**
   * A boolean flag indicating whether the user has administrative privileges.
   * @type {boolean}
   */
  isAdmin: boolean;

  /**
   * The identifier for the profile associated with the user.
   * @type {string}
   */
  profile_id: string;

  /**
   * An optional path related to the user.
   * @type {string | undefined}
   */
  path?: string;

  /**
   * An optional filter for routes associated with the user.
   * @type {string | undefined}
   */
  routeFilter?: string;
}

/**
 * Extends the Express Request interface to include user information.
 * This allows the `userInfo` object to be accessible on all requests within the application.
 */
declare module "express-serve-static-core" {
  interface Request {
    /**
     * The information of the authenticated user making the request.
     * This will be available in all routes and middlewares handling the request.
     * @type {userInfo}
     */
    userInfo: userInfo;
  }
}
