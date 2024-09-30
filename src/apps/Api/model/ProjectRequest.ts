import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import User from "../../Auth/model/User";

/**
 * Represents a project request entity in the database.
 * A project request contains a description, an attached file (as a path or URL), and creation and update timestamps.
 */
@Entity("projects_requests")
export default class ProjectRequest {

  /**
   * Unique identifier for each project request. Automatically generated as a UUID.
   *
   * @type {string}
   */
  @PrimaryGeneratedColumn("uuid")
  id: string;

  /**
   * The user who requested the project.
   * This field establishes a many-to-one relationship with the `User` entity.
   * A user can make multiple project requests.
   *
   * @type {User}
   */
  @ManyToOne(() => User, { nullable: false })
  user: User;

  /**a
   * Description of the project request.
   * This is a required field and is stored as a varchar.
   *
   * @type {string}
   */
  @Column({ type: "varchar", nullable: false })
  description: string;

  /**
   * Path or URL to the attached file related to the project request.
   * In databases, files are usually stored as paths or URLs, not as `File` objects.
   *
   * @type {string}
   */
  @Column({ type: "varchar", nullable: true })
  attachedFile: string;

  /**
   * The timestamp when the project request was created.
   * This value is automatically set when the project request is first created.
   *
   * @type {Date}
   */
  @CreateDateColumn({
    type: "timestamp with time zone",
    nullable: false,
  })
  createdAt: Date;

  /**
   * The timestamp when the project request was last updated.
   * This value is automatically updated every time the project request is modified.
   *
   * @type {Date}
   */
  @UpdateDateColumn({
    type: "timestamp with time zone",
    nullable: false,
  })
  updatedAt: Date;

    /**
   * Constructor with all arguments for ProjectRequest.
   *
   * @param {string} id - The unique identifier of the project request.
   * @param {string} description - The description of the project request.
   * @param {string} attachedFile - The path or URL to the attached file.
   * @param {User} user - The user who requested the project.
   * @param {Date} createdAt - The creation timestamp of the project request.
   * @param {Date} updatedAt - The update timestamp of the project request.
   */
    constructor(id: string, description: string, attachedFile: string, user: User, createdAt: Date, updatedAt: Date) {
      this.id = id;
      this.description = description;
      this.attachedFile = attachedFile;
      this.user = user;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }

}
