import { Router } from "express";
import { authMiddleware } from "../../../middlewares/auth";
import validateResponseMiddleware from "../../../middlewares/validateResponse";
import attachmentController from "../controller/AttachmentController";
import upload from "../../../middlewares/multer";

// Instância do router para gerenciar rotas relacionadas a anexos
const attachmentRouter: Router = Router();

// Middleware para validação de respostas
// attachmentRouter.use(validateResponseMiddleware);

// // Middleware para autenticação
// attachmentRouter.use(authMiddleware);

/**
 * Rota para fazer upload de um novo anexo
 * Método: POST
 * Endpoint: /attachments/upload
 */
attachmentRouter.post(
  "/upload",
  upload.single("file"),
  attachmentController.uploadAttachment
);

/**
 * Rota para obter um anexo pelo ID
 * Método: GET
 * Endpoint: /attachments/getById/:id
 */
attachmentRouter.get(
  "/getById/:id",
  attachmentController.getById
);

/**
 * Rota para listar todos os anexos
 * Método: GET
 * Endpoint: /attachments/getAll
 */
attachmentRouter.get(
  "/getAll",
  attachmentController.getAll
);

/**
 * Rota para atualizar um anexo pelo ID
 * Método: PUT
 * Endpoint: /attachments/update/:id
 */
attachmentRouter.put(
  "/update/:id",
  upload.single("file"),
  attachmentController.update
);

/**
 * Rota para deletar um anexo pelo ID
 * Método: DELETE
 * Endpoint: /attachments/delete/:id
 */
attachmentRouter.delete(
  "/delete/:id",
  attachmentController.delete
);

export default attachmentRouter;
