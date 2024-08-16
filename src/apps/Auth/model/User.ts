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

  @Column({ type: "date", nullable: false })
  birthDate: Date;

  @Column({ type: "varchar", unique: true, nullable: true })
  phone: string;

  @Column({ type: "uuid", nullable: false })
  profile_id: string;

  @ManyToOne(() => Profile, (profile) => profile.users, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "profiles_id" })
  profile: Profile;

  @Column({ type: "boolean", default: true })
  isAtivo: boolean;

  @Column({ type: "varchar", nullable: false })
  password_hash: string;

  password: string;

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
