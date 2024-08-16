"use strict";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import User from "./User";

@Entity("profiles")
class Profile {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "varchar", unique: true, nullable: true })
	name: string;

	@Column({ type: "varchar", nullable: true, unique: true })
	description: string;

	@Column({ type: "boolean", default: false })
	isAdmin: boolean;

	@OneToMany(() => User, (user) => user.profile, { cascade: true })
	users: User[];
}

export default Profile;

