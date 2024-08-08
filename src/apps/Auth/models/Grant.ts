import { Model, DataTypes } from "sequelize";
import dbConnection from "../../../database/connection";

class Grant extends Model {
	declare id: string;
	declare grant: string;
	declare note: string;
	declare routeFilter: string;
	declare route: string;
}

Grant.init(
	{
		id: {
			type: DataTypes.UUIDV4,
			primaryKey: true,
			allowNull: false,
			defaultValue: DataTypes.UUIDV4,
		},
		grant: { type: DataTypes.STRING, allowNull: false },
		note: { type: DataTypes.TEXT, allowNull: true },
		routeFilter: { type: DataTypes.STRING, allowNull: true },
		route: { type: DataTypes.STRING, allowNull: false },
	},
	{
		sequelize: dbConnection,
		modelName: "grants",
		underscored: true,
	}
);

export default Grant;
