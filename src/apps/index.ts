import { Router } from "express";
import testRouter from "../teste";
import projectRequestRouter from "./Api/routes/ProjectRequestRoutes";
import projectRouter from "./Api/routes/ProjectRoutes";
import sectorRouter from "./Api/routes/SectorRoutes";
import authenticationRouter from "./Auth/routes";
import chatRouter from "./Messaging/routes/ChatRoutes";
import messagesRouter from "./Messaging/routes/MessageRoutes";

const router: Router = Router();

router.use("/accounts", authenticationRouter);
router.use("/messages", messagesRouter);
router.use("/projects", projectRouter);
router.use("/projectRequests", projectRequestRouter);
router.use("/sectors", sectorRouter);
router.use("/chat", chatRouter);
router.use("/test", testRouter);

export default router;
