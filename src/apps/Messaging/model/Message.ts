import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import User from "../../Auth/model/User";
import UserGroup from "../../Auth/model/UserGroup";

/**
 * Represents a message in the system.
 *
 * The Message entity is associated with both users and user groups,
 * allowing for messages to be sent from one user to another
 * or to an entire user group.
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
   * The user group that receives the message.
   *
   * @type {UserGroup}
   * @memberof Message
   */
  @ManyToOne(() => UserGroup, (group) => group.messages, { nullable: false })
  @JoinColumn({ name: "receiver_group_id" })
  receiverGroup: UserGroup;

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
   * @param {UserGroup} receiverGroup - The user group that receives the message.
   * @param {Date} sendedAt - The timestamp when the message was sent.
   */
  constructor(
    text: string,
    sender: User,
    receiver: User,
    receiverGroup: UserGroup,
    sendedAt: Date
  ) {
    this.text = text;
    this.sender = sender;
    this.receiver = receiver;
    this.receiverGroup = receiverGroup;
    this.sendedAt = sendedAt;
  }
}
