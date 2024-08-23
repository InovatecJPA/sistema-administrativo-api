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

@Entity("users")
class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", nullable: false })
  name: string;

  @Column({ type: "varchar", unique: true, nullable: false })
  cpf: string;

  @Column({ type: "varchar", unique: true, nullable: false })
  email: string;

  @Column({ type: "date", nullable: true })
  birthDate: Date;

  @Column({ type: "varchar", unique: true, nullable: true })
  phone: string;

  @ManyToOne(() => Profile, (profile) => profile.users, {
    nullable: false,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "profile_id" })
  profile: Profile;

  @Column({ type: "boolean", default: true })
  isAtivo: boolean;

  @Column({ type: "varchar", nullable: false })
  password_hash: string;

  password: string;

  @CreateDateColumn({ type: "timestamp with time zone", nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp with time zone", nullable: false })
  updated_at: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password_hash = await bcryptjs.hash(this.password, 10);
    }
  }

  public async validPassword(password: string): Promise<boolean> {
    return bcryptjs.compare(password, this.password_hash);
  }
}

export default User;
