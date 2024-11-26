import { Router } from "express";
import projectRouter from "./Api/routes/ProjectRoutes";
import sectorRouter from "./Api/routes/SectorRoutes";
import chatRouter from "./Messaging/routes/ChatRoutes";
import messagesRouter from "./Messaging/routes/MessageRoutes";
import authRouter from "./Auth/routes/authRoutes";
import userRouter from "./Auth/routes/userRoutes";
import grantRouter from "./Auth/routes/grantRoutes";
import profileRouter from "./Auth/routes/profileRoutes";
import attachmentRouter from "./Messaging/routes/AttachmentRoutes";

const router: Router = Router();

router.use("/accounts", authRouter);
router.use("/user", userRouter);
router.use("/grant", grantRouter);
router.use("/profile", profileRouter);
router.use("/project", projectRouter);
router.use("/sector", sectorRouter);
router.use("/messages", messagesRouter);
router.use("/chat", chatRouter);
router.use("/attachment", attachmentRouter);

export default router;
