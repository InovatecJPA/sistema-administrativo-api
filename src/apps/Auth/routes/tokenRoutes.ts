import { Router } from "express";
import { Request, Response } from "express";
import tokenController from "../controller/TokenController";
import validateResponserMiddleware from "../../../middlewares/validateResponse";

const router = Router();
router.use(validateResponserMiddleware);

router.post("/", tokenController.store);
router.get("/", (req: Request, res: Response) => {
  res.send("Hello Tokens!");
});

export default router;
