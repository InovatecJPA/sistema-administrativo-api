"use strict";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from "typeorm";
import Grant from "./Grant";

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

  /**
   * The grant associated with the profile. This establishes a one-to-one relationship with the `Grant` entity.
   * 
   * @type {Grant}
   * @memberof ProfileGrant
   * @relation
   */
  @OneToOne(() => Grant)
  @JoinColumn()
  grant: Grant;

  /**
   * The timestamp when the profile-grant association was created.
   * 
   * @type {Date}
   * @memberof ProfileGrant
   */
  @CreateDateColumn({ type: "timestamp with time zone", nullable: false, name: "created_at" })
  createdAt: Date;
  
  /**
   * The timestamp when the profile-grant association was last updated.
   * 
   * @type {Date}
   * @memberof ProfileGrant
   */
  @UpdateDateColumn({ type: "timestamp with time zone", nullable: false, name: "updated_at" })
  updatedAt: Date;
}
