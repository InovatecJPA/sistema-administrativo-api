import { authMiddleware } from "../../../middlewares/auth";
import { Router } from "express";
import validateResponseMiddleware from "../../../middlewares/validateResponse";
import { grantController } from "../controller/GrantController";

const router: Router = Router();
router.use(validateResponseMiddleware);

router.post("/", grantController.post);
router.get("/:name",  grantController.get);
router.get("/:id",  grantController.getById);
router.get("/list", grantController.getAll);
router.put("/:id",  grantController.put);
router.delete("/:id", grantController.delete);

export default router;