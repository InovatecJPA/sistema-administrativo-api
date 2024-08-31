import { Router } from "express";
import UserController from "../controller/UserController";

import { authMiddleware } from "../../../middlewares/auth";
import validateResponseMiddleware from "../../../middlewares/validateResponse";

const router: Router = Router();
router.use(validateResponseMiddleware);


router.get("/", UserController.listPaginated); // lista todos os usuários

router.delete("/:id", UserController.delete);
router.get("/profile", authMiddleware, UserController.show);

export default router;

/*
index -> lista todos os usuários -> GET
store/create -> cria um novo usuário -> POST
delete -> apaga um usuário -> DELETE
show -> mostra um usuário -> GET
update -> atualiza um usuário -> PATCH ou PUT
*/
