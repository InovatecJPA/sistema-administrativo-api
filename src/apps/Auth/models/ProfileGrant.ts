"use strict";
import dbConnection from "../../../database/dbConnection";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("profile_grants")
class ProfileGrant {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "varchar", nullable: true })
	status: string;
}

/* 
class ProfileGrant extends Model {
	declare id: string;
	declare status: string;
}

ProfileGrant.init(
	{
		id: {
			type: DataTypes.UUIDV4,
			primaryKey: true,
			allowNull: false,
			defaultValue: DataTypes.UUIDV4,
		},
		status: { type: DataTypes.STRING, allowNull: true },
	},
	{
		sequelize: dbConnection,
		modelName: "profile_grants",
		underscored: true,
	}
);
 */

export default ProfileGrant;
