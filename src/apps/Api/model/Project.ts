import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import User from "../../Auth/model/User";
import Sector from "./Sector";

/**
 * Represents a project entity in the database.
 * A project has multiple coordinators (Users), is related to multiple sectors, and can be associated with a project request.
 * Each project also has creation and update timestamps.
 */
@Entity("projects")
export default class Project {
  /**
   * Unique identifier for each project. Automatically generated as a UUID.
   *
   * @type {string}
   */
  @PrimaryGeneratedColumn("uuid")
  id: string;

  /**
   * Name of the project.
   * This is a required field and is stored as a varchar.
   *
   * @type {string}
   */
  @Column({ type: "varchar", nullable: false })
  name: string;

  /**
   * List of users who are the coordinators for the project.
   * This field establishes a many-to-many relationship with the User entity.
   * A project can have multiple coordinators.
   *
   * @type {User[]}
   */
  @ManyToMany(() => User)
  @JoinTable()
  coordinators: User[];

  /**
   * List of users who are the members for the project.
   * This field establishes a many-to-many relationship with the User entity.
   * A project can have multiple members.
   *
   * @type {User[]}
   */
  @ManyToMany(() => User)
  @JoinTable()
  members: User[];

  /**
   * List of sectors associated with the project.
   * This field establishes a many-to-many relationship with the Sector entity.
   * A project can belong to multiple sectors.
   *
   * @type {Sector[]}
   */
  @ManyToMany(() => Sector)
  @JoinTable()
  sectors: Sector[];

  /**
   * The timestamp when the project was created.
   * This value is automatically set when the project is first created.
   *
   * @type {Date}
   */
  @CreateDateColumn({
    type: "timestamp with time zone",
    nullable: false,
  })
  createdAt: Date;

  /**
   * The timestamp when the project was last updated.
   * This value is automatically updated every time the project is modified.
   *
   * @type {Date}
   */
  @UpdateDateColumn({
    type: "timestamp with time zone",
    nullable: false,
  })
  updatedAt: Date;

  /**
   * Constructor to create a Project instance with all fields.
   *
   * @param {string} name - The name of the project.
   * @param {Date} createdAt - The timestamp when the project was created.
   * @param {Date} updatedAt - The timestamp when the project was last updated.
   */
  constructor(
    name: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
