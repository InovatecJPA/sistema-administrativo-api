import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import User from "./User";
import ProfileGrant from "./ProfileGrant";

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

  @OneToMany(() => ProfileGrant, (profileGrant) => profileGrant.profile) // Define a relação com ProfileGrant
  profileGrants: ProfileGrant[];

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
}
