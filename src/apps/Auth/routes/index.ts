import { Router } from "express";

import setCORSMiddleware from "../../../middlewares/setCORS";

const router: Router = Router();
router.use(setCORSMiddleware);

export default router;