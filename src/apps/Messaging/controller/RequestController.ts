import { Request, Response } from "express";
import { requestService, RequestService } from "../service/RequestService"; // Assuming your service is in the service folder

export class RequestController {
  private requestService: RequestService;

  constructor(requestService: RequestService) {
    this.requestService = requestService;
  }

  async post(req: Request, res: Response): Promise<void> {
    try {
      const { name, userIds } = req.body;

      if (!name || !userIds || userIds.length === 0) {
        res.status(400).send("Name and at least one userId are required.");
        return;
      }

      const newRequest = await this.requestService.createRequest(name, userIds);
      res.status(201).json(newRequest);

    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.query.userId as string;
      const requests = await this.requestService.getAllRequests(userId);
      res.status(200).json(requests);
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const requestId = req.params.id;
      const request = await this.requestService.getRequestById(requestId);
      if (!request) {
        res.status(404).send("Request not found.");
        return;
      }
      res.status(200).json(request);
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  }

  async postUsers(req: Request, res: Response): Promise<void> {
    try {
      const { requestId, userIds } = req.body;

      if (!requestId || !userIds || userIds.length === 0) {
        res.status(400).send("RequestId and at least one userId are required.");
        return;
      }

      const updatedRequest = await this.requestService.addUsersToRequest(requestId, userIds);
      res.status(200).json(updatedRequest);
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { requestId, userId } = req.body;

      if (!requestId || !userId) {
        res.status(400).send("RequestId and userId are required.");
        return;
      }

      const updatedRequest = await this.requestService.removeUserFromRequest(requestId, userId);
      res.status(200).json(updatedRequest);
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  }

  async postMessage(req: Request, res: Response): Promise<void> {
    try {
      const { requestId, messageId } = req.body;

      if (!requestId || !messageId) {
        res.status(400).send("RequestId and messageId are required.");
        return;
      }

      const updatedRequest = await this.requestService.addMessageToRequest(requestId, messageId);
      res.status(200).json(updatedRequest);
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  }

  async postAttachment(req: Request, res: Response): Promise<void> {
    try {
      const { requestId, attachmentId } = req.body;

      if (!requestId || !attachmentId) {
        res.status(400).send("RequestId and attachmentId are required.");
        return;
      }

      const updatedRequest = await this.requestService.addAttachmentToRequest(requestId, attachmentId);
      res.status(200).json(updatedRequest);
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  }

  async deleteRequest(req: Request, res: Response): Promise<void> {
    try {
      const requestId = req.params.id;
      await this.requestService.deleteRequest(requestId);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  }

  async getMessages(req: Request, res: Response): Promise<void> {
    try {
      const requestId = req.params.id;
      const messages = await this.requestService.getMessagesFromRequest(requestId);
      res.status(200).json(messages);
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  }

  async getAttachments(req: Request, res: Response): Promise<void> {
    try {
      const requestId = req.params.id;
      const attachments = await this.requestService.getAttachmentsFromRequest(requestId);
      res.status(200).json(attachments);
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  }
}

export const requestController: RequestController = new RequestController(requestService);
