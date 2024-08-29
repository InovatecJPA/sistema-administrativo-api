"use strict";
import bcryptjs from "bcryptjs";
import Profile from "./Profile";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

/**
 * Represents a user in the system.
 *
 * @@Entity("users")
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
    onDelete: "SET NULL",
    //eager: true
  })
  @JoinColumn({ name: "profile_id" })
  profile: Profile;

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

  @BeforeUpdate()
  /**
   * Hashes the user's password before inserting or updating the user record in the database.
   *
   * @private
   * @memberof User
   */
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

  public async comparePassword(password: string): Promise<boolean> {
    return bcryptjs.compare(password, this.passwordHash);
  }

  public getFirstName(): string {
    return this.name.split(" ")[0];
  }

  public getLastName(): string {
    return this.name.split(" ")[1];
  }
}

export default User;
