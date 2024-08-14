import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}

export default Grant;
