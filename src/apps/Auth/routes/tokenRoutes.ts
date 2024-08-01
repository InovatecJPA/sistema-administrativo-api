import { Router } from "express";
import tokenController from "../controller/TokenController";
const validateResponserMiddleware = require("../../../middlewares/validateResponse");

const router: Router = Router();
router.use(validateResponserMiddleware);

router.post("/", tokenController.store);

export default router;
