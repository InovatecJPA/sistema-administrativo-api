import { resolve } from "path";
import express, { Request, Response, Application, NextFunction } from "express";

import cors, { CorsOptions } from "cors";
import helmet from "helmet";

import validateResponse from "./middlewares/setCORS";
import dbConnection from "./database/connection";

// import v1 from "./apps";
// import swaggerUi from "swagger-ui-express";
// import swaggerDocument from "../swagger.json";

const whiteList = ["http://localhost:3000"];

const corsOptions: CorsOptions = {
	origin: function (
		origin: string | undefined,
		callback: (err: Error | null, allow?: boolean) => void
	) {
		if (whiteList.indexOf(origin || "") !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
};

class App {
	public app: express.Application;

	constructor() {
		this.app = express();
		this.middlewares();
		this.routes();

		this.errorHandling();
	}

	middlewares() {
		this.app.use(cors(corsOptions));
		this.app.use(helmet());
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));

		this.app.use(validateResponse);
	}

	routes() {
		//this.app.use("/api-docs", swaggerUi.serve);
		//this.app.get("/api-docs", swaggerUi.setup(swaggerDocument));

		//this.app.use("/v1", v1);
		this.app.get("/", (req: Request, res: Response) => {
			res.send("Hello World!");
		});
		this.app.get("/testDB", (req: Request, res: Response) => {
			dbConnection
				.authenticate()
				.then(() => {
					res.send("Connected to database");
				})
				.catch((error: Error) => {
					res.send("Error connecting to database");
				});
		});
	}

	private errorHandling(): void {
		this.app.use(
			(err: Error, req: Request, res: Response, next: NextFunction) => {
				console.error(err.stack);
				res.status(500).send("Something broke!");
			}
		);
	}
}

export default new App().app;
