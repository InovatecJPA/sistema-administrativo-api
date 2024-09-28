import { Router } from "express";
import validateResponseMiddleware from "../../../middlewares/validateResponse";
import { authMiddleware } from "../../../middlewares/auth";
import messageController from "../controller/MessageController"

const messagesRouter: Router = Router();
messagesRouter.use(validateResponseMiddleware);

messagesRouter.post("/post", authMiddleware, messageController.post);
messagesRouter.get("/getByDate/:sendedAtDay", authMiddleware, messageController.getByDate);
messagesRouter.get("/getById/:id", authMiddleware, messageController.getById);
messagesRouter.get("/getAll", authMiddleware, messageController.getAll);
messagesRouter.put("/put/:id", authMiddleware, messageController.put);
messagesRouter.delete("/delete/:id", authMiddleware, messageController.deleteById);

export default messagesRouter;
