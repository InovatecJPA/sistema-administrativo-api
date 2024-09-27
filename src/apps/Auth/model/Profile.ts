import Grant from "./Grant";
import User from "./User";

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

/**
 * Represents a user profile entity in the system.
 *
 * @Entity("profiles")
 */
@Entity("profiles")
export default class Profile {
  /**
   * The unique identifier for the profile.
   *
   * @type {string}
   * @memberof Profile
   */
  @PrimaryGeneratedColumn("uuid")
  id: string;

  /**
   * The name of the profile. It must be unique.
   *
   * @type {string}
   * @memberof Profile
   */
  @Column({ type: "varchar", unique: true, nullable: true })
  name: string;

  /**
   * A description of the profile. It must be unique.
   *
   * @type {string}
   * @memberof Profile
   */
  @Column({ type: "varchar", nullable: true, unique: true })
  description: string;

  /**
   * The users associated with this profile.
   *
   * @type {User[]}
   * @memberof Profile
   */
  @OneToMany(() => User, (user) => user.profile, { cascade: true })
  users: User[];

  /**
   * The grants associated with this profile.
   * Defines a many-to-many relationship with the `Grant`.
   *
   * @type {Grant[]}
   * @memberof Profile
   */
  @ManyToMany(() => Grant, { eager: true })
  associatedGrants: Grant[];

  /**
   * The timestamp when the profile was created.
   *
   * @type {Date}
   * @memberof Profile
   */
  @CreateDateColumn({
    type: "timestamp with time zone",
    nullable: false,
  })
  createdAt: Date;

  /**
   * The timestamp when the profile was last updated.
   *
   * @type {Date}
   * @memberof Profile
   */
  @UpdateDateColumn({
    type: "timestamp with time zone",
    nullable: false,
  })
  updatedAt: Date;

  /**
   * Creates an instance of the Profile class.
   *
   * @param name - The name of the profile.
   * @param description - A description of the profile.
   */
  constructor(
    name: string,
    description: string,
    users?: User[],
    associatedGrants?: Grant[]
  ) {
    this.name = name;
    this.description = description;
    this.users = users;
    this.associatedGrants = associatedGrants;
  }
}
