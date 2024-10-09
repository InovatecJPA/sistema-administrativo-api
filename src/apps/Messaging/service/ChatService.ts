import { DeleteResult, FindOptionsWhere, Repository } from "typeorm";
import Chat from "../model/Chat";
import { InvalidObjectError } from "../../../error/InvalidObjectError";
import AppDataSource from "../../../database/dbConnection";

export class ChatService {

  private chatRepository: Repository<Chat>;

  constructor(chatRepository: Repository<Chat>) {
    this.chatRepository = chatRepository;
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
        where: {id},
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

  async update(id: string, chat: Partial<Chat>): Promise<Chat> {
    return this.chatRepository.save({
      ...chat,
      id,
    });
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
export const chatService = new ChatService(chatRepository);
