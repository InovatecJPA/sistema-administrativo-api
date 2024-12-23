import { Request, Response } from "express";
import { attachmentService } from "../service/AttachmentService";
import Attachment from "../model/Attachment";



interface MulterRequest extends Request {
  file?: Express.Multer.File;
}
class AttachmentController {
  async uploadAttachment(req: Request, res: Response): Promise<Response> {
    const file = req.file;
    console.log(file);

    if (!file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    try {
      const attachment = await attachmentService.createAttachment(
        file.originalname,
        file.mimetype,
        file.buffer
      );

      console.log("Attachment created successfully.");
      console.log(attachment);

      return res.status(201).json(attachment);
    } catch (error) {
      return res.status(500).json({ message: "Error saving attachment.", error });
    }
  }

  // Obter anexo por ID
  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const attachment = await attachmentService.findOneById(id);

      if (!attachment) {
        return res.status(404).json({ message: "Attachment not found." });
      }

      return res.status(200).json(attachment);
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving attachment.", error });
    }
  }

  // Obter todos os anexos
  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const attachments = await attachmentService.findAll();
      return res.status(200).json(attachments);
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving attachments.", error });
    }
  }

  // Atualizar um anexo
  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file provided for update." });
    }

    try {
      const updatedAttachment = await attachmentService.update(
        id,
        { fileName: file.originalname, mimeType: file.mimetype, data: file.buffer }
      );

      if (!updatedAttachment) {
        return res.status(404).json({ message: "Attachment not found for update." });
      }

      return res.status(200).json(updatedAttachment);
    } catch (error) {
      return res.status(500).json({ message: "Error updating attachment.", error });
    }
  }

  // Deletar um anexo
  async delete(req: Request, res: Response): Promise<Response> {
    const { id }= req.params;

    try {
      const deleted = await attachmentService.delete(id);

      if (!deleted) {
        return res.status(404).json({ message: "Attachment not found for deletion." });
      }

      return res.status(200).json({ message: "Attachment deleted successfully." });
    } catch (error) {
      return res.status(500).json({ message: "Error deleting attachment.", error });
    }
  }
}

export default new AttachmentController();
