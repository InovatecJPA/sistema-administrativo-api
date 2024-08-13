import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import dbConnection from "../../../database/data-source";

@Entity("grants")
class Grant {
	@PrimaryGeneratedColumn("uuid") // Define o tipo UUID
	id: string;

	@Column({ type: "varchar", nullable: false })
	grant: string;

	@Column({ type: "text", nullable: true })
	note: string;

	@Column({ type: "varchar", nullable: true })
	routeFilter: string;

	@Column({ type: "varchar", nullable: false })
	route: string;
}

/* 
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
 */
export default Grant;
