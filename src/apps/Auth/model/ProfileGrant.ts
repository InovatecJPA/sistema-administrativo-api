"use strict";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("profile_grants")
class ProfileGrant {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", nullable: true })
  status: string;
}

export default ProfileGrant;
