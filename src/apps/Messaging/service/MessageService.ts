import { 
  DeleteResult, 
  FindOptionsWhere, 
  LessThan, 
  MoreThanOrEqual, 
  Repository 
} from "typeorm";
import MessageDto from "../dto/MessageDto";
import Message from "../model/Message";
import { InvalidObjectError } from "../../../error/InvalidObjectError";
import AppDataSource from "../../../database/dbConnection";
import User from "../../Auth/model/User";
import Chat from "../model/Chat";

export class MessageService {
  private messageRepository: Repository<Message>;
  private userRepository: Repository<User>;
  private chatRepository: Repository<Chat>;

  constructor(
    messageRepository: Repository<Message>,
    userRepository: Repository<User>,
    chatRepository: Repository<Chat>
  ) {
    this.messageRepository = messageRepository;
    this.userRepository = userRepository;
    this.chatRepository = chatRepository;
  }

  async sendMessage(messageDto: MessageDto): Promise<Message> {
    
    if (!messageDto.isValid()) {
      throw new InvalidObjectError("Invalid message object.");
    }

    const sender = messageDto.getSender();
    const receiver = messageDto.getReceiver();
    const text = messageDto.getText();


    if (!sender || !receiver) {
      throw new Error("Sender or receiver not found.");
    }

    let chat = await this.chatRepository
      .createQueryBuilder("chat")
      .innerJoin("chat.users", "user")
      .where("user.id IN (:...userIds)", { userIds: [sender.id, receiver.id] })
      .groupBy("chat.id")
      .having("COUNT(user.id) = 2")
      .getOne();

    
    if (!chat) {
      chat = this.chatRepository.create({
        name: `${sender.name} & ${receiver.name}`,
        users: [sender, receiver],
      });
      await this.chatRepository.save(chat);
    }

   
    const message = this.messageRepository.create({
      text,
      sender,
      receiver,
      chat,
      sendedAt: new Date(),
    });

    
    return await this.messageRepository.save(message);
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

  async findAllByDate(sendedAtDay: string): Promise<Message[]> {
    const startOfDay = new Date(sendedAtDay);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(sendedAtDay);
    endOfDay.setHours(23, 59, 59, 999);

    return this.messageRepository.find({
      where: [
        { sendedAt: MoreThanOrEqual(startOfDay) },
        { sendedAt: LessThan(endOfDay) },
      ],
    });
  }

  async update(id: string, object: Partial<Message>): Promise<Message> {
    return this.messageRepository.save({
      ...object,
      id,
    });
  }

  async delete(id: string): Promise<DeleteResult> {
    const messageToDelete = await this.messageRepository.findOneBy({ id });
    if (!messageToDelete) {
      throw new InvalidObjectError(`Message with ID ${id} not found`);
    }
    return await this.messageRepository.delete({ id });
  }
}

// Inicializa os repositórios e exporta a instância do serviço
const messageRepository: Repository<Message> = AppDataSource.getRepository(Message);
const userRepository: Repository<User> = AppDataSource.getRepository(User);
const chatRepository: Repository<Chat> = AppDataSource.getRepository(Chat);

export const messageService = new MessageService(
  messageRepository,
  userRepository,
  chatRepository
);
