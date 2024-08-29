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
  AfterLoad,
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
    //eager: true
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

  @BeforeUpdate()
  @BeforeInsert()
  async hashPassword() : Promise<void> {
    try {
      if (this.password) {
        console.log("fazendo hash da senha!!!")
        this.password_hash = await bcryptjs.hash(this.password, 10);
      }
    } catch (e) {
      console.log("Error on hashPassword: ", e);
    }
  }

  public async comparePassword(password: string): Promise<boolean> {
    return bcryptjs.compare(password, this.password_hash);
  }

  public getFirstName(): string {
    return this.name.split(" ")[0];
  }

  public getLastName(): string {
    return this.name.split(" ")[1];
  }
}

export default User;
