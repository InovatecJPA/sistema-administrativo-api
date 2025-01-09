import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import Request from "./Request";

@Entity()
export default class Attachment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  fileName: string;

  @Column()
  mimeType: string;

  @Column("bytea")
  data: Buffer;

  @OneToOne(() => Request, (request) => request.attachments)
  request: Request;

}
