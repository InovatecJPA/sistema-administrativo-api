import { Router } from "express";
import UserController from "../controller/UserController";

import { authMiddleware } from "../../../middlewares/auth";
import validateResponseMiddleware from "../../../middlewares/validateResponse";
import { validateData } from "../middlewares/validationMiddleware";
import { updateUserSchema } from "../schemas/userSchemas";

const userRouter: Router = Router();
userRouter.use(validateResponseMiddleware);

userRouter.get("/", authMiddleware, UserController.show); // Detalhes do usuário logado
userRouter.get("/list", authMiddleware, UserController.listPaginated); // lista todos os usuários
userRouter.get("/listAll", authMiddleware, UserController.listAll); // lista todos os usuários
userRouter.patch("/:id/update", authMiddleware,validateData(updateUserSchema), UserController.update);
userRouter.put("/:id/update/profile", authMiddleware, UserController.updateUserProfile);
userRouter.delete("/:id", UserController.delete);

export default userRouter;
