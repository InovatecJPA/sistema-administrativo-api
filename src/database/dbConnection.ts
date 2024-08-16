import { dbConfig } from "../config/dbConfig";
import { DataSource } from "typeorm";

// (Sequelize as any).postgres.DECIMAL.parse = function (value: any): number {
// 	return parseFloat(value);
// };

const AppDataSource = new DataSource(dbConfig);

AppDataSource.initialize()
	.then(() => {
		console.log("Conexão com o banco de dados estabelecida com sucesso!");
	})
	.catch((error) => {
		console.error("Erro ao conectar com o banco de dados", error);
	});

export default AppDataSource;
