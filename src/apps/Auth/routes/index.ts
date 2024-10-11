import { Router } from "express";

import setCORSMiddleware from "../../../middlewares/setCORS";

import authRoutes from "./authRoutes";
import grantRoutes from "./grantRoutes";
import profileRouter from "./profileRoutes";
import tokenRoutes from "./tokenRoutes";
import userRoutes from "./userRoutes";

const router: Router = Router();
router.use(setCORSMiddleware);

router.use("/user", userRoutes);
router.use("/user", authRoutes);
router.use("/tokens", tokenRoutes);
router.use("/grant", grantRoutes);
router.use("/profiles", profileRouter);

export default router;
