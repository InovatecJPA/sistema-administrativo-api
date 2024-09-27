import { Router } from 'express';

import { authMiddleware } from '../../../middlewares/auth';
import profileController from '../controller/ProfileController';
import validateResponseMiddleware from '../../../middlewares/validateResponse';

const router: Router = Router();
router.use(validateResponseMiddleware);

router.get("/store", authMiddleware, profileController.store);
router.post("/post", authMiddleware, profileController.post);
router.get("/getByName/:name", authMiddleware, profileController.get);
router.get("/getById/:id", authMiddleware, profileController.getById);
router.get("/getAll", authMiddleware, profileController.getAll);
router.put("/put/:id", authMiddleware, profileController.put);
router.delete("/delete/:id", authMiddleware, profileController.deleteById);

export default router;