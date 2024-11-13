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

router.use("/accounts", authRouter); // mapeado e documentado
router.use("/user", userRouter); // mapeado e documentado
router.use("/grant", grantRouter); // falta mapear
router.use("/profile", profileRouter); // falta mapear
router.use("/project", projectRouter); // falta doc 
router.use("/sector", sectorRouter); // falta mapear
router.use("/messages", messagesRouter); // falta doc
router.use("/chat", chatRouter); // falta mapear - não é prioridade

export default router;
