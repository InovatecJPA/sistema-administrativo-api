import { Router } from "express";

import setCORSMiddleware from "../../../middlewares/setCORS";

import userRoutes from "./userRoutes";
import tokenRoutes from "./tokenRoutes";
import authRoutes from "./authRoutes";
import grantRoutes from "./grantRoutes";

const router: Router = Router();
router.use(setCORSMiddleware);

router.use("/user", userRoutes);
router.use("/user", authRoutes);
router.use("/tokens", tokenRoutes);
router.use("/grant", grantRoutes);

export default router;
