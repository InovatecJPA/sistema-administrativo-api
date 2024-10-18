import { response, Router } from "express";

import { authMiddleware } from "../../../middlewares/auth";
import { grantController } from "../controller/GrantController";
import validateResponseMiddleware from "../../../middlewares/validateResponse";

const router: Router = Router();
router.use(validateResponseMiddleware);

router.post("/post", authMiddleware, grantController.post);
router.get("/getByName/:name", authMiddleware, grantController.get);
router.get("/getById/:id", authMiddleware, grantController.getById);
router.get("/getAll", authMiddleware, grantController.getAll);
router.put("/put/:id", authMiddleware, grantController.put);
router.delete("/delete/:id", authMiddleware, grantController.deleteById);
router.post("/:id/postProfile", authMiddleware, grantController.postProfile);
router.post("/:id/postSector", authMiddleware, grantController.postSector);

export default router;