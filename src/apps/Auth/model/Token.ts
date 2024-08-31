import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  OneToOne,
} from "typeorm";
import User from "./User";

@Entity("tokens")
export default class Token {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @Index()
  userId: string;

  @Column({ unique: true, nullable: false })
  token: string;

  @Column({ default: false, nullable: false })
  isUsed: boolean;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @OneToOne(() => User, (user) => user.tokens, { onDelete: "CASCADE" })
  user: User;
}
