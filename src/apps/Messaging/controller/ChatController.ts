import { Request, Response } from "express";
import { chatService } from "../service/ChatService";

class ChatController {
  

  async createChat(req: Request, res: Response): Promise<Response> {
    try {
      const chatData = req.body;
      const newChat = await chatService.save(chatData);
      return res.status(201).json(newChat);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  
  async getChatById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const chat = await chatService.findOneById(id);
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }
      return res.status(200).json(chat);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }


  async getAllChats(req: Request, res: Response): Promise<Response> {
    try {
      const chats = await chatService.findAll();
      return res.status(200).json(chats);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getByName(req: Request, res: Response): Promise<Response> {
    try {
      const { name } = req.params;
      const chat = await chatService.findByName(name);
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }
      return res.status(200).json(chat);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateChat(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const chatData = req.body;
      const updatedChat = await chatService.update(id, chatData);
      return res.status(200).json(updatedChat);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  
  async deleteChat(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await chatService.delete(id);
      return res.status(204).json();
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  }
}

export default new ChatController();
