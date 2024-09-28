import { Router } from "express";
import sectorRouter from "./sectorRoutes"; 

const router: Router = Router();


router.use("/sector", sectorRouter);

export default router; 
