import { Router } from "express";
import userController from "../controller/UserController";

//import AuthMiddlware...
import validateResponseMiddleware from "../../../middlewares/validateResponse";

const router: Router = Router();
router.use(validateResponseMiddleware);

router.post("/", userController.store);

export default router;

/*
index -> lista todos os usuários -> GET
store/create -> cria um novo usuário -> POST
delete -> apaga um usuário -> DELETE
show -> mostra um usuário -> GET
update -> atualiza um usuário -> PATCH ou PUT
*/
