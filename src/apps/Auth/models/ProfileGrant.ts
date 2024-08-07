"use strict";
import { Model, DataTypes } from "sequelize";
import dbConnection from "../../../database/connection";

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
