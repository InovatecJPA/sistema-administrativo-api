import "reflect-metadata";
const dotenv = require("dotenv");
import { DataSourceOptions } from "typeorm";
import path from "path";

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
	entities: [path.join(__dirname + "/../apps/**/models/*.ts")],
	migrations: [path.join(__dirname, "/../database/migrations/*{.ts,.js}")],
};

console.log(
	`Database HOST (./config/database.ts): ${process.env.DATABASE_HOST}`
);
