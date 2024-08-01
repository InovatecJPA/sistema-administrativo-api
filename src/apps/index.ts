import { Router } from "express";
import autenticacao from "./Auth/routes";

const router: Router = Router();

router.use("/accounts", autenticacao);

export default router;