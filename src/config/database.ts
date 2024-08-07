import dotenv from "dotenv";
import { Dialect } from "sequelize";

const envFile = process.env.NODE_ENV === "dev" ? ".env.dev" : ".env.deploy";
dotenv.config({ path: envFile });

console.log(process.env.DATABASE_HOST);

const dbConfig = {
	/* SQLite */
	// dialect: 'sqlite',
	// storage: './db.sqlite',

	/* MySQL / MariaDB */
	dialect: "postgres" as Dialect,
	host: process.env.DATABASE_HOST,
	port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT) : 5432, // Default port
	username: process.env.DATABASE_USERNAME,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE,
	dialectOptions: {
		ssl: {
			require: true,
			rejectUnauthorized: false,
		},
	},

	// dialectOptions: {
	//   timezone: 'America/Sao_Paulo',
	// },
	// timezone: 'America/Sao_Paulo',

	/* ALL */
	define: {
		timestamps: true,
		underscored: true,
		underscoredAll: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
	},
};

export default dbConfig;
