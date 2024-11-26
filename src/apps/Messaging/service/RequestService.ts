import Request from "../model/Request";
import User from "../../Auth/model/User";
import Message from "../model/Message";
import Attachment from "../model/Attachment";
import { Repository } from "typeorm";
import { userService } from "../../Auth/service/UserService";
import { messageService } from "./MessageService";
import { attachmentService } from "./AttachmentService";

class RequestService {
  private requestRepository: Repository<Request>;

  constructor(requestRepository: Repository<Request>) {
    this.requestRepository = requestRepository;
  }

  async createRequest(name: string, userIds: string[]): Promise<Request> {
    if (userIds.length === 0) {
        throw new Error("No users IDs provided");
    }
    
    let users: User[] = [];

    userIds.forEach((userId) => {
        userService.findOne({ id: userId }).then((user) => {
            if (!userService.findOne({ id: userId })) {
                throw new Error("User not found");
            }
            users.push(user)
        });

    });

    if (users.length === 0) {
        throw new Error("No users found");
    }

    const request = this.requestRepository.create({
      name,
      users,
    });

    return await this.requestRepository.save(request);
  }

  // Get all requests, optionally filtered by user
  async getAllRequests(userId?: string): Promise<Request[]> {
    if (userId) {
      const user: User = await userService.findOne({ id: userId });
      return await this.requestRepository
        .createQueryBuilder("request")
        .leftJoinAndSelect("request.users", "user")
        .where("user.id = :userId", { userId })
        .getMany();
    }
    return await this.requestRepository.find({ relations: ["users", "messages", "attachments"] });
  }

  async getRequestById(id: string): Promise<Request | null> {
    const request = await this.requestRepository.findOne({
        where: { id }, 
        relations: ["users", "messages", "attachments"],
    });
    return request || null;
  }

  // Add users to a request (could be a chat or group)
  async addUsersToRequest(requestId: string, userIds: string[]): Promise<Request> {
    const request = await this.getRequestById(requestId);
    if (!request) {
      throw new Error("Request not found");
    }

    let users: User[] = [];

    userIds.forEach((userId) => {
        userService.findOne({ id: userId }).then((user) => {
            if (!userService.findOne({ id: userId })) {
                throw new Error("User not found");
            }
            users.push(user)
        });

    });

    if (users.length === 0) {
        throw new Error("No users found");
    }

    request.users = [...request.users, ...users];

    return await this.requestRepository.save(request);
  }

  async removeUserFromRequest(requestId: string, userId: string): Promise<Request> {
    const request = await this.getRequestById(requestId);
    if (!request) {
      throw new Error("Request not found");
    }

    const userIndex = request.users.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
      throw new Error("User not part of the request");
    }

    request.users.splice(userIndex, 1);

    return await this.requestRepository.save(request);
  }

  async addMessageToRequest(requestId: string, messageId: string): Promise<Request> {
    const request: Request = await this.getRequestById(requestId);
    if (!request) {
      throw new Error("Request not found");
    }

    const message: Message = await messageService.findOneById(messageId);
    if (!message) {
        throw new Error("Message not found");
      }

    request.messages.push(message);
    return await this.requestRepository.save(request);
  }

  async addAttachmentToRequest(requestId: string, attachmentId: string): Promise<Request> {
    const request = await this.getRequestById(requestId);
    if (!request) {
      throw new Error("Request not found");
    }

    const attachment: Attachment = await attachmentService.findOneById(attachmentId);
    if (!attachment) {
        throw new Error("Attachment not found");
      }

    request.attachments.push(attachment);
    return await this.requestRepository.save(request);
  }

  async deleteRequest(id: string): Promise<void> {
    const request = await this.getRequestById(id);
    if (!request) {
      throw new Error("Request not found");
    }
  
    if (request.messages && request.messages.length > 0) {
      await messageService.deleteMessagesByRequestId(id);
    }
  
    if (request.attachments && request.attachments.length > 0) {
      await attachmentService.deleteAttachmentsByRequestId(id);
    }
  
    await this.requestRepository.remove(request);
  }
  
  async getMessagesFromRequest(requestId: string): Promise<Message[]> {
    const request = await this.getRequestById(requestId);
    if (!request) {
      throw new Error("Request not found");
    }

    return request.messages;
  }

  async getAttachmentsFromRequest(requestId: string): Promise<Attachment[]> {
    const request = await this.getRequestById(requestId);
    if (!request) {
      throw new Error("Request not found");
    }

    return request.attachments;
  }
}

export default RequestService;
