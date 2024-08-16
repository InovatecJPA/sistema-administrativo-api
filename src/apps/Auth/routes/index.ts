import { Router } from "express";

import setCORSMiddleware from "../../../middlewares/setCORS";

import userRoutes from "./userRoutes";
import tokenRoutes from "./tokenRoutes";

const router: Router = Router();
router.use(setCORSMiddleware);

router.use("/users", userRoutes);
router.use("/tokens", tokenRoutes);

export default router;
