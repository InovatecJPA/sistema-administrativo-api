import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Chat from "./Solicitation";
import Solicitation from "./Solicitation";

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

  @ManyToOne(() => Solicitation, (solicitation) => solicitation.attachments, {nullable: false})
  @JoinColumn({name: "solicitation_id"})
  solicitation: Solicitation;

}
