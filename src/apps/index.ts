import { Router } from "express";
import authenticationRouter from "./Auth/routes";

const router: Router = Router();

router.use("/accounts", authenticationRouter);

export default router;