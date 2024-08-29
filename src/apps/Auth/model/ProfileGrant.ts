import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import Grant from "./Grant";
import Profile from "./Profile";

/**
 * Represents a profile-grant association entity in the system.
 *
 * @Entity("profile_grants")
 */
@Entity("profile_grants")
export default class ProfileGrant {
  /**
   * The unique identifier for the profile-grant association.
   *
   * @type {string}
   * @memberof ProfileGrant
   */
  @PrimaryGeneratedColumn("uuid")
  id: string;

  /**
   * The status of the profile-grant association. This field is optional.
   *
   * @type {string}
   * @memberof ProfileGrant
   */
  @Column({ type: "varchar", nullable: true })
  status: string;

  @ManyToOne(() => Grant, (grant) => grant.profileGrants, { eager: true }) // Define a relação ManyToOne com Grant
  @JoinColumn({ name: "grant_id" }) // Nome da coluna de chave estrangeira
  grant: Grant;

  @ManyToOne(() => Profile, (profile) => profile.profileGrants) // Define a relação ManyToOne com Profile
  @JoinColumn({ name: "profile_id" }) // Nome da coluna de chave estrangeira
  profile: Profile;

  /**
   * The timestamp when the profile-grant association was created.
   *
   * @type {Date}
   * @memberof ProfileGrant
   */
  @CreateDateColumn({
    type: "timestamp with time zone",
    nullable: false,
  })
  createdAt: Date;

  /**
   * The timestamp when the profile-grant association was last updated.
   *
   * @type {Date}
   * @memberof ProfileGrant
   */
  @UpdateDateColumn({
    type: "timestamp with time zone",
    nullable: false,
  })
  updatedAt: Date;
}
