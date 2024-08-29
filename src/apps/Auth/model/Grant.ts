import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import ProfileGrant from "./ProfileGrant";

@Entity("grants")
class Grant {
  @PrimaryGeneratedColumn("uuid") // Chave primária do tipo UUID
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

  // Relação com ProfileGrant
  @OneToMany(() => ProfileGrant, (profileGrant) => profileGrant.grant)
  profileGrants: ProfileGrant[];
}

export default Grant;
