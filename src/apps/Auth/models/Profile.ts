"use strict";
import { Model, DataTypes } from "sequelize";
import dbConnection from "../../../database/connection";
import User from "./User";

class Profile extends Model {
	declare id: string;
	declare name: string;
	declare description: string;
	declare isAdmin: boolean;
}

Profile.init(
	{
		id: {
			type: DataTypes.UUIDV4,
			primaryKey: true,
			allowNull: false,
			defaultValue: DataTypes.UUIDV4,
		},
		name: { type: DataTypes.STRING, allowNull: true },
		description: { type: DataTypes.STRING, allowNull: true, unique: true },
		isAdmin: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
	},
	{
		sequelize: dbConnection,
		modelName: "profiles",
		underscored: true,
	}
);

Profile.hasMany(User, {
	foreignKey: "profiles_id",
	as: "users",
});

export default Profile;
