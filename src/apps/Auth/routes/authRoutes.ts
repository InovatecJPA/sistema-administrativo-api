import { Router } from "express";
import { authMiddleware } from "../../../middlewares/auth";
import validateResponseMiddleware from "../../../middlewares/validateResponse";
import { authController } from "../controller/AuthController";
import { validateData } from "../middlewares/validationMiddleware";
import {
  changePasswordSchema,
  forgortPasswordSchema,
  resetPasswordSchema,
  userLoginSchema,
  userResistrationSchema,
} from "../schemas/userSchemas";

/**
 * Router for handling authentication-related routes.
 * Includes registration, login, password reset requests, and password change functionalities.
 */
const authRouter: Router = Router();

// Middleware to validate all response formats
authRouter.use(validateResponseMiddleware);

/**
 * @route POST /singUp
 * @description Registers a new user in the system.
 * Validates the incoming data against `userResistrationSchema`.
 * Calls the `singUp` method in `authController` to handle user registration.
 */
authRouter.post(
  "/singUp",
  validateData(userResistrationSchema),
  authController.singUp
);

/**
 * @route POST /login
 * @description Authenticates a user based on email and password.
 * Validates the incoming data against `userLoginSchema`.
 * Calls the `login` method in `authController` to handle user login.
 */
authRouter.post("/login", validateData(userLoginSchema), authController.login);

/**
 * @route POST /forgotPassword
 * @description Initiates a password reset process by generating a reset token.
 * Validates the incoming data against `forgortPasswordSchema`.
 * Calls the `requestResetToken` method in `authController` to send a reset token to the user's email.
 */
authRouter.post(
  "/forgotPassword",
  validateData(forgortPasswordSchema),
  authController.requestResetToken
);

/**
 * @route POST /resetPassword/:token
 * @description Resets a user's password using a token sent to their email.
 * Validates the incoming data against `resetPasswordSchema`.
 * Calls the `resetPassword` method in `authController` to authorize and change the user's password.
 * @param {string} token - Token for resetting the password, provided as a URL parameter.
 */
authRouter.post(
  "/resetPassword/:token",
  validateData(resetPasswordSchema),
  authController.resetPassword
);

/**
 * @route PATCH /changePassword
 * @description Allows an authenticated user to change their password.
 * Requires authentication via `authMiddleware`.
 * Validates the incoming data against `changePasswordSchema`.
 * Calls the `changePassword` method in `authController` to update the password.
 */
authRouter.patch(
  "/changePassword",
  validateData(changePasswordSchema),
  authMiddleware,
  authController.changePassword
);

export default authRouter;
