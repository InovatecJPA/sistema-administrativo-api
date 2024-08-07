import dotenv from "dotenv";
import { Dialect } from "sequelize";

const envFile = process.env.NODE_ENV === "dev" ? ".env.dev" : ".env.deploy";
dotenv.config({ path: envFile });

console.log(process.env.DATABASE_HOST);

const dbConfig = {
	dialect: "postgres" as Dialect,
	host: process.env.DATABASE_HOST,
	port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT) : 5432,
	username: process.env.DATABASE_USERNAME,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE,
	dialectOptions: {
		ssl: {
			require: true,
			rejectUnauthorized: false,
			native:true,
			// timezone: 'America/Sao_Paulo',
		},
		// timezone: 'America/Sao_Paulo',
	},

	define: {
		timestamps: true,
		underscored: true,
		underscoredAll: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
	},
};

export default dbConfig;
