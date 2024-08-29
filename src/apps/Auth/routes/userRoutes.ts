import { Router } from "express";
import UserController from "../controller/UserController";

import { authMiddleware } from "../../../middlewares/auth";
import validateResponseMiddleware from "../../../middlewares/validateResponse";

const router: Router = Router();
router.use(validateResponseMiddleware);

router.post("/", UserController.store);
router.post("/recover", UserController.recoveryPassword);

router.get("/AllUsers", UserController.indexAll);
router.delete("/:id", UserController.delete);
router.post("/login", UserController.login);
router.get("/profile", authMiddleware, UserController.show);

export default router;

/*
index -> lista todos os usuários -> GET
store/create -> cria um novo usuário -> POST
delete -> apaga um usuário -> DELETE
show -> mostra um usuário -> GET
update -> atualiza um usuário -> PATCH ou PUT
*/
