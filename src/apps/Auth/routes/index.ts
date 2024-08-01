import { Router } from "express";

import validateResponserMiddleware from "../../../middlewares/validateResponse";

const router: Router = Router();
router.use(validateResponserMiddleware);

export default router;