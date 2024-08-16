import { Router } from "express";

import setCORSMiddleware from "../../../middlewares/setCORS";

import userRoutes from "./userRoutes";

const router: Router = Router();
router.use(setCORSMiddleware);

router.use("/users", userRoutes);

export default router;
