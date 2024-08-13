import { dbConfig } from "../config/database";
import { DataSource } from "typeorm";

(Sequelize as any).postgres.DECIMAL.parse = function (value: any): number {
	return parseFloat(value);
};

export const AppDataSource = new DataSource(dbConfig);
