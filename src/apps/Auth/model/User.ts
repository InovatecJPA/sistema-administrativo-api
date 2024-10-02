"use strict";
import bcryptjs from "bcryptjs";
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import Sector from "../../Api/model/Sector";
import Message from "../../Messaging/model/Message";
import Profile from "./Profile";
import Token from "./Token";

/**
 * Represents a user in the system.
 *
 * The User entity is associated with messages, profiles, user groups, and tokens.
 *
 * @Entity("users")
 */
@Entity("users")
class User {
  /**
   * The unique identifier for the user.
   *
   * @type {string}
   * @memberof User
   */
  @PrimaryGeneratedColumn("uuid")
  id: string;

  /**
   * The name of the user.
   *
   * @type {string}
   * @memberof User
   */
  @Column({ type: "varchar", nullable: false })
  name: string;

  /**
   * The CPF (Cadastro de Pessoas Físicas) of the user, which is a unique identifier in Brazil.
   *
   * @type {string}
   * @memberof User
   */
  @Column({ type: "varchar", unique: true, nullable: false })
  cpf: string;

  /**
   * The email address of the user. It must be unique.
   *
   * @type {string}
   * @memberof User
   */
  @Column({ type: "varchar", unique: true, nullable: false })
  email: string;

  /**
   * The birth date of the user.
   *
   * @type {Date}
   * @memberof User
   */
  @Column({ type: "date", nullable: true })
  birthDate: Date;

  /**
   * The phone number of the user. It must be unique.
   *
   * @type {string}
   * @memberof User
   */
  @Column({ type: "varchar", unique: true, nullable: true })
  phone: string;

  /**
   * The profile associated with the user.
   *
   * @type {Profile}
   * @memberof User
   */
  @ManyToOne(() => Profile, (profile) => profile.users, {
    nullable: false,
    // nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "profile_id" })
  profile: Profile;

  /**
   * The sector associated with the user.
   *
   * @type {Sector}
   * @memberof User
   */
  @ManyToOne(() => Sector, (sector) => sector.users, {
    // nullable: false,
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "sector_id" })
  sector: Sector;

  /**
   * The messages sent by the user.
   *
   * @type {Message[]}
   * @memberof User
   */
  @OneToMany(() => Message, (message) => message.sender)
  messagesSended: Message[];

  /**
   * The messages received by the user.
   *
   * @type {Message[]}
   * @memberof User
   */
  @OneToMany(() => Message, (message) => message.receiver)
  messagesReceived: Message[];

  /**
   * Indicates whether the user's account is active.
   *
   * @type {boolean}
   * @memberof User
   */
  @Column({ type: "boolean", default: true })
  isActive: boolean;

  /**
   * The hashed password of the user.
   *
   * @type {string}
   * @memberof User
   */
  @Column({ type: "varchar", nullable: false })
  passwordHash: string;

  /**
   * The plain-text password provided by the user for authentication purposes.
   *
   * @type {string}
   * @memberof User
   */
  password: string;

  /**
   * The timestamp when the user was created.
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
   * The timestamp when the user was last updated.
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
   * Hashes the user's password before inserting or updating the user record in the database.
   *
   * @private
   * @memberof User
   */
  @BeforeUpdate()
  @BeforeInsert()
  async hashPassword(): Promise<void> {
    try {
      if (this.password) {
        this.passwordHash = await bcryptjs.hash(this.password, 10);
      }
    } catch (e) {
      console.log("Error on hashPassword: ", e);
    }
  }

  /**
   * Compares a provided password with the user's hashed password.
   *
   * @param password - The plain-text password to compare.
   * @returns A promise that resolves to a boolean indicating if the passwords match.
   */
  public async comparePassword(password: string): Promise<boolean> {
    return bcryptjs.compare(password, this.passwordHash);
  }

  /**
   * Gets the first name of the user.
   *
   * @returns The first name as a string.
   */
  public getFirstName(): string {
    return this.name.split(" ")[0];
  }

  /**
   * Gets the last name of the user.
   *
   * @returns The last name as a string.
   */
  public getLastName(): string {
    return this.name.split(" ").slice(1).join(" ");
  }

  /**
   * The token associated with the user.
   *
   * @type {Token}
   * @memberof User
   */
  @OneToOne(() => Token, (token) => token.user)
  token: Token;
}

export default User;
