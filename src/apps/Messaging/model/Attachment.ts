import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import Message from "./Message";

@Entity()
export class Attachment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  fileName: string;

  @Column()
  mimeType: string;

  @Column("bytea")
  data: Buffer;

  @OneToOne(() => Message, (message) => message.attachment, { onDelete: "CASCADE" })
  message: Message;
}
