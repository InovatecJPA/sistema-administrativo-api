import { Router } from "express";
import authenticationRouter from "./Auth/routes";
import messagesRouter from "./Messaging/routes/MessageRouter";

const router: Router = Router();

router.use("/accounts", authenticationRouter);
router.use("/messages", messagesRouter);

export default router;