import { Router } from 'express';

import { authMiddleware } from '../../../middlewares/auth';
import validateResponseMiddleware from '../../../middlewares/validateResponse';
import profileController from '../controller/ProfileController';

const profileRouter: Router = Router();
profileRouter.use(validateResponseMiddleware);

profileRouter.get("/store", authMiddleware, profileController.store);
profileRouter.post("/post", authMiddleware, profileController.post);
profileRouter.get("/getByName/:name", authMiddleware, profileController.get);
profileRouter.get("/getById/:id", authMiddleware, profileController.getById);
profileRouter.get("/getAll", authMiddleware, profileController.getAll);
profileRouter.put("/put/:id", authMiddleware, profileController.put);
profileRouter.delete("/delete/:id", authMiddleware, profileController.deleteById);
profileRouter.post("/postUser/:id", authMiddleware, profileController.postUser);
profileRouter.delete("/deleteUser/:id", authMiddleware, profileController.deleteUser);
profileRouter.post("/postGrant/:id", authMiddleware, profileController.postGrant);
profileRouter.delete("/deleteGrant/:id", authMiddleware, profileController.deleteGrant);

export default profileRouter;