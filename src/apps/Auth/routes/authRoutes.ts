import {
  userResistrationSchema,
  forgortPasswordSchema,
  userLoginSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from "../schemas/userSchemas";
import e, { Router } from "express";
import { authController } from "../controller/AuthController";
import validateResponseMiddleware from "../../../middlewares/validateResponse";
import { validateData } from "../middlewares/validationMiddleware";
import { authMiddleware } from "../../../middlewares/auth";

const router: Router = Router();
router.use(validateResponseMiddleware);

router.post(
  "/singUp",
  validateData(userResistrationSchema),
  authController.singUp
); // registro

router.post("/login", validateData(userLoginSchema), authController.login); // login
// Logout gerenciado pelo front-end

router.post(
  "/forgotPassword",
  validateData(forgortPasswordSchema),
  authController.requestResetToken
); // token para redefinir senha enviado para email

router.post(
  "/resetPassword/:token",
  validateData(resetPasswordSchema),
  authController.resetPassword
); // recebe token e da autorização para redefinir senha

router.patch(
  "/changePassword",
  validateData(changePasswordSchema),
  authMiddleware,
  authController.changePassword
); // redefinir senha

export default router;
