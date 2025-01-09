import { DeleteResult, FindOptionsWhere, Repository } from "typeorm";
import Chat from "../model/Solicitation";
import { InvalidObjectError } from "../../../error/InvalidObjectError";
import AppDataSource from "../../../database/dbConnection";
import User from "../../Auth/model/User";

export class ChatService {
  private chatRepository: Repository<Chat>;
  private userRepository: Repository<User>;

  constructor(chatRepository: Repository<Chat>, userRepository: Repository<User>) {
    this.chatRepository = chatRepository;
    this.userRepository = userRepository;
  }

  async save(chat: Partial<Chat>): Promise<Chat> {
    if (chat.users && chat.users.length > 0) {
      return this.chatRepository.save(chat);
    } else {
      throw new InvalidObjectError("Invalid chat object. Chat must have at least one user.");
    }
  }

  async findOneById(id: string): Promise<Chat> {
    return this.chatRepository.findOne({
      where: { id },
      relations: ["users", "messages"],
    });
  }

  async findAll(): Promise<Chat[]> {
    return this.chatRepository.find({ 
      relations: ["users", "messages"], 
    });
  }

  async findByName(name: string): Promise<Chat> {
    return this.chatRepository.findOne({
      where: { name },
      relations: ["users", "messages"],
    });
  }

  async addUsers(chatId: string, userIds: string[]): Promise<Chat> {
    const chat = await this.chatRepository.findOne({ where: { id: chatId }, relations: ["users"] });
    
    if (!chat) {
      throw new Error('Chat not found');
    }

    const users = await this.userRepository.findByIds(userIds);

    chat.users = [...chat.users, ...users];

    return this.chatRepository.save(chat);
  }

  async removeUsers(chatId: string, userIds: string[]): Promise<Chat> {
    const chat = await this.chatRepository.findOne({ where: { id: chatId }, relations: ["users"] });
  
    if (!chat) {
      throw new Error('Chat not found');
    }
  
    
    chat.users = chat.users.filter(user => !userIds.includes(user.id));
  
    
    return this.chatRepository.save(chat);
  }
  
  async updateChatName(chatId: string, newName: string): Promise<Chat> {
    const chat = await this.chatRepository.findOne({ where: { id: chatId } });
  
    if (!chat) {
      throw new Error('Chat not found');
    }
  
    chat.name = newName; 
  
    return this.chatRepository.save(chat); 
  }
  

  


  async delete(id: string): Promise<DeleteResult> {
    const chatToDelete = await this.chatRepository.findOneBy({ id });
    if (!chatToDelete) {
      throw new InvalidObjectError(`Chat with ID ${id} not found`);
    }
    return await this.chatRepository.delete({ id });
  }
}

const chatRepository: Repository<Chat> = AppDataSource.getRepository(Chat);
const userRepository: Repository<User> = AppDataSource.getRepository(User);
export const chatService = new ChatService(chatRepository, userRepository);
