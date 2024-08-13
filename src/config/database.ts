import "reflect-metadata";
const dotenv = require("dotenv");
import { DataSourceOptions } from "typeorm";

dotenv.config();

export const dbConfig: DataSourceOptions = {
	type: "postgres",
	host: process.env.DATABASE_HOST,
	port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT) : 5432,
	username: process.env.DATABASE_USERNAME,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE,
	synchronize: false,
	logging: true,
	entities: [__dirname + "/../apps/**/models/*.ts"],
	migrations: [__dirname + "/database/migrations/*.ts"],
};

console.log(
	`Database HOST (./config/database.ts): ${process.env.DATABASE_HOST}`
);
