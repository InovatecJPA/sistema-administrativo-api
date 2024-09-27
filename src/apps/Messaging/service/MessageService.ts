import { DeleteResult, FindOptionsWhere, Repository } from "typeorm";
import ServiceInterface from "../../Auth/interface/ServiceInterface";
import MessageDto from "../dto/MessageDto";
import Message from "../model/Message";
import { InvalidObjectError } from "../../../error/InvalidObjectError";
import AppDataSource from "../../../database/dbConnection";

export class MessageService implements ServiceInterface<Message, MessageDto> {

  private messageRepository: Repository<Message>;

  constructor(messageRepository: Repository<Message>) {
    this.messageRepository = messageRepository;
  }


  async save(objectDto: Partial<MessageDto>): Promise<Message> {
    if (objectDto.isValid()) {
      return this.messageRepository.save(objectDto.toMessage());
    } else {
      throw new InvalidObjectError("Invalid message object.");
    }
  }

  async findOne(object: Partial<Message>): Promise<Message> {
    return this.messageRepository.findOne({ 
      where: object as FindOptionsWhere<Message>,
    });
  }

  async findOneById(id: string): Promise<Message> {
    return this.messageRepository.findOneBy({ id });
  }

  async findAll(): Promise<Message[]> {
    return this.messageRepository.find();
  }

  async update(id: string, object: Partial<Message>): Promise<Message> {
    return this.messageRepository.save({
      ...object,
      id,
    })
  }
  
  async delete(id: string): Promise<DeleteResult> {
    const profileToDelete = await this.messageRepository.findOneBy({ id });
    if (!profileToDelete) {
      throw new InvalidObjectError(`Message with ID ${id} not found`);
    }
    return await this.messageRepository.delete({ id });
  }
}

// Initialize the repository and export the service instance
const messageRepository: Repository<Message> = AppDataSource.getRepository(Message);
export const messageService = new MessageService(messageRepository);
