import { authMiddleware } from "../../../middlewares/auth";
import { Router } from "express";
import validateResponseMiddleware from "../../../middlewares/validateResponse";
import { grantController } from "../controller/GrantController";

const router: Router = Router();
router.use(validateResponseMiddleware);

router.post("/post", authMiddleware, grantController.post);
router.get("/getByName/:name", authMiddleware, grantController.get);
router.get("/getById/:id", authMiddleware, grantController.getById);
router.get("/getAll", authMiddleware, grantController.getAll);
router.put("/put/:id", authMiddleware, grantController.put);
router.delete("/delete/:id", authMiddleware, grantController.deleteById);

export default router;