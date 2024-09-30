import { Router } from "express";
import projectRequestRouter from "./Api/routes/ProjectRequestRoutes";
import projectRouter from "./Api/routes/ProjectRoutes";
import sectorRouter from "./Api/routes/SectorRoutes";
import authenticationRouter from "./Auth/routes";
import messagesRouter from "./Messaging/routes/MessageRoutes";

const router: Router = Router();

router.use("/accounts", authenticationRouter);
router.use("/messages", messagesRouter);
router.use("/projects", projectRouter);
router.use("/projectRequests", projectRequestRouter);
router.use("/sectors", sectorRouter);

export default router;
