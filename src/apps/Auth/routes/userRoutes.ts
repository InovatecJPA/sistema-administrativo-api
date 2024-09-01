import { Router } from "express";
import UserController from "../controller/UserController";

import { authMiddleware } from "../../../middlewares/auth";
import validateResponseMiddleware from "../../../middlewares/validateResponse";

const router: Router = Router();
router.use(validateResponseMiddleware);


router.post("/", authMiddleware, UserController.show); // Detalhes do usuário logado
router.get("/list", authMiddleware, UserController.listPaginated); // lista todos os usuários
router.patch("/:id/update", authMiddleware, UserController.update);
router.put(
  "/:id/update/profile",
  authMiddleware,
  UserController.updateUserProfile
);

//não atualizados
router.delete("/:id", UserController.delete);

export default router;

/*
index -> lista todos os usuários -> GET
store/create -> cria um novo usuário -> POST
delete -> apaga um usuário -> DELETE
show -> mostra um usuário -> GET
update -> atualiza um usuário -> PATCH ou PUT
*/
