import { Router } from 'express';
import { requestController } from '../controller/RequestController';
import validateResponseMiddleware from '../../../middlewares/validateResponse';
import { authMiddleware } from '../../../middlewares/auth';

const requestRouter: Router = Router();

// Middleware for validating responses
requestRouter.use(validateResponseMiddleware);

// Middleware for authenticating requests
requestRouter.use(authMiddleware);

requestRouter.post('/requests', requestController.post);
requestRouter.get('/requests', requestController.getAll);
requestRouter.get('/requests/:id', requestController.getById);
requestRouter.post('/requests/add-users', requestController.postUsers);
requestRouter.post('/requests/remove-user', requestController.deleteUser);
requestRouter.post('/requests/add-message', requestController.postMessage);
requestRouter.post('/requests/add-attachment', requestController.postAttachment);
requestRouter.delete('/requests/:id', requestController.deleteRequest);
requestRouter.get('/requests/:id/messages', requestController.getMessages);
requestRouter.get('/requests/:id/attachments', requestController.getAttachments);

export default requestRouter;