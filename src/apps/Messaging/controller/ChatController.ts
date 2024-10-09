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
  
      const filteredChat = {
        id: chat.id,
        name: chat.name,
        users: chat.users.map(user => ({
          id: user.id,
          name: user.name
        })),
        messages: chat.messages
      };
  
      return res.status(200).json(filteredChat);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  


  async getAllChats(req: Request, res: Response): Promise<Response> {
    try {
     
      const chats = await chatService.findAll();
      const filteredChats = chats.map(chat => ({
        id: chat.id,
        name: chat.name,
        users: chat.users.map(user => ({
          id: user.id,
          name: user.name
        })),
        messages: chat.messages 
      }));

      return res.status(200).json(filteredChats);
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
  
      const filteredChat = {
        id: chat.id,
        name: chat.name,
        users: chat.users.map(user => ({
          id: user.id,
          name: user.name
        })),
        messages: chat.messages
      };
  
      return res.status(200).json(filteredChat);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  
  async addUsersToChat(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params; // ID do chat
      const { userIds }: { userIds: string[] } = req.body; // Lista de IDs dos usuários
  
      const updatedChat = await chatService.addUsers(id, userIds);
  
      if (updatedChat) {
        const users = updatedChat.users.map(user => ({
          id: user.id,
          name: user.name
        }));
  
        return res.status(200).json({
          chatId: updatedChat.id,
          users
        });
      }
  
      return res.status(404).json({ message: 'Chat not found' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error: error.message });
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
