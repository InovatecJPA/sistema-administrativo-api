import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import User from "../../Auth/model/User";
import Message from "../../Messaging/model/Message";

@Entity("sectors")
export default class Sector {
  /**
   * The unique identifier for the sector.
   *
   * @type {string}
   * @memberof Sector
   */
  @PrimaryGeneratedColumn("uuid")
  id: string;

  /**
   * The name of the sector.
   *
   * @type {string}
   * @memberof Sector
   */
  @Column({ type: "varchar", nullable: false })
  name: string;

  /**
   * A brief description of the sector.
   *
   * @type {string}
   * @memberof Sector
   */
  @Column({ type: "varchar", nullable: false })
  description: string;

  /**
   * The users associated with this sector.
   *
   * @type {User[]}
   * @memberof Sector
   */
  @OneToMany(() => User, (user) => user.sector, { cascade: true })
  users: User[];

  @OneToMany(() => Message, (message) => message.receiverGroup)
  messages: Message[];

  /**
   * The timestamp when the sector was created.
   *
   * @type {Date}
   * @memberof User
   */
  @CreateDateColumn({
    type: "timestamp with time zone",
    nullable: false,
  })
  createdAt: Date;

  /**
   * The timestamp when the sector was last updated.
   *
   * @type {Date}
   * @memberof User
   */
  @UpdateDateColumn({
    type: "timestamp with time zone",
    nullable: false,
  })
  updatedAt: Date;

  /**
   * Constructor for creating an instance of `Sector`.
   *
   * @param {string} name - The name of the sector.
   * @param {string} description - The description of the sector.
   */
  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }
}
