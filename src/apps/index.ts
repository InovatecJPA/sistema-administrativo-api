import { Router } from "express";
import projectRouter from "./Api/routes/ProjectRoutes";
import sectorRouter from "./Api/routes/SectorRoutes";
import chatRouter from "./Messaging/routes/ChatRoutes";
import messagesRouter from "./Messaging/routes/MessageRoutes";
import authRouter from "./Auth/routes/authRoutes";
import userRouter from "./Auth/routes/userRoutes";
import grantRouter from "./Auth/routes/grantRoutes";
import profileRouter from "./Auth/routes/profileRoutes";

const router: Router = Router();

router.use("/accounts", authRouter);
router.use("/user", userRouter);
router.use("/grant", grantRouter);
router.use("/profile", profileRouter);
router.use("/messages", messagesRouter);
router.use("/project", projectRouter);
router.use("/sector", sectorRouter);
router.use("/chat", chatRouter);

export default router;
