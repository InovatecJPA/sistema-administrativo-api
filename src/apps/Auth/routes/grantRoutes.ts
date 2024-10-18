import { response, Router } from "express";

import { authMiddleware } from "../../../middlewares/auth";
import { grantController } from "../controller/GrantController";
import validateResponseMiddleware from "../../../middlewares/validateResponse";

const grantRouter: Router = Router();
grantRouter.use(validateResponseMiddleware);

grantRouter.post("/post", authMiddleware, grantController.post);
grantRouter.get("/getByName/:name", authMiddleware, grantController.get);
grantRouter.get("/getById/:id", authMiddleware, grantController.getById);
grantRouter.get("/getAll", authMiddleware, grantController.getAll);
grantRouter.put("/put/:id", authMiddleware, grantController.put);
grantRouter.delete("/delete/:id", authMiddleware, grantController.deleteById);
grantRouter.post("/:id/postProfile", authMiddleware, grantController.postProfile);
grantRouter.post("/:id/postSector", authMiddleware, grantController.postSector);

export default grantRouter;