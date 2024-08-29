import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import Grant from "./Grant";
import Profile from "./Profile";

@Entity("profile_grants")
class ProfileGrant {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", nullable: true })
  status: string;

  @CreateDateColumn({ type: "timestamp with time zone", nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp with time zone", nullable: false })
  updated_at: Date;

  @ManyToOne(() => Grant, (grant) => grant.profileGrants, { eager: true }) // Define a relação ManyToOne com Grant
  @JoinColumn({ name: "grant_id" }) // Nome da coluna de chave estrangeira
  grant: Grant;

  @ManyToOne(() => Profile, (profile) => profile.profileGrants) // Define a relação ManyToOne com Profile
  @JoinColumn({ name: "profile_id" }) // Nome da coluna de chave estrangeira
  profile: Profile; 
}

export default ProfileGrant;
