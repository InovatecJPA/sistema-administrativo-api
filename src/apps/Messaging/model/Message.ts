import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Sector from "../../Api/model/Sector";
import User from "../../Auth/model/User";
import Chat from "./Chat";
import { Attachment } from "./Attachment";

/**
 * Represents a message in the system.
 *
 * The Message entity is associated with both users and user sectors,
 * allowing for messages to be sent from one user to another
 * or to an entire user sector.
 */
@Entity("messages")
export default class Message {
  /**
   * The unique identifier for the message.
   *
   * @type {string}
   * @memberof Message
   */
  @PrimaryGeneratedColumn("uuid")
  id: string;

  /**
   * The text content of the message.
   *
   * @type {string}
   * @memberof Message
   */
  @Column({ type: "varchar", nullable: false })
  text: string;

  /**
   * The user who sent the message.
   *
   * @type {User}
   * @memberof Message
   */
  @ManyToOne(() => User, (user) => user.messagesSended, { nullable: false })
  @JoinColumn({ name: "sender_id" })
  sender: User;

  /**
   * The user who receives the message.
   *
   * @type {string}
   * @memberof Message
   */
  @ManyToOne(() => User, (user) => user.messagesReceived, { nullable: false })
  @JoinColumn({ name: "receiver_id" })
  receiver: User;

  /**
   * The user sector that receives the message.
   *
   * @type {Sector}
   * @memberof Message
   */
  @ManyToOne(() => Sector, (sector) => sector.messages)
  @JoinColumn({ name: "receiver_sector_id" })
  receiverSector: Sector;

  /**
   * The chat that the message belongs to.
   * @type {Chat}
   * @memberof Message
   */
  @ManyToOne(() => Chat, (chat) => chat.messages, { nullable: false })
  @JoinColumn({ name: "chat_id" })
  chat: Chat;

  /**
   * The timestamp indicating when the message was sent.
   *
   * @type {Date}
   * @memberof Message
   */
  @Column({ type: "timestamp with time zone", nullable: false })
  sendedAt: Date;

  /**
   * Creates an instance of the Message class.
   *
   * @param {string} text - The text content of the message.
   * @param {User} sender - The user who sends the message.
   * @param {User} receiver - The user who receives the message.
   * @param {Sector} receiverSector - The user sector that receives the message.
   * @param {Date} sendedAt - The timestamp when the message was sent.
   */
  constructor(
    text: string,
    sender: User,
    receiver: User,
    receiverSector: Sector,
    sendedAt: Date
  ) {
    this.text = text;
    this.sender = sender;
    this.receiver = receiver;
    this.receiverSector = receiverSector;
    this.sendedAt = sendedAt;
  }
}
