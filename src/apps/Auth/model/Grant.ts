import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("grants")
class Grant {
  @PrimaryGeneratedColumn("uuid") // Defines the primary key as a UUID
  id: string;

  @Column({ type: "varchar", unique: true, nullable: false })
  grant: string;

  @Column({ type: "text", nullable: true })
  note: string;

  @Column({ type: "varchar", nullable: true })
  routeFilter: string;

  @Column({ type: "varchar", nullable: false })
  route: string;

  @CreateDateColumn({ type: "timestamp with time zone", nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp with time zone", nullable: false })
  updated_at: Date;
}

export default Grant;
