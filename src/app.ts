import { resolve } from "path";

import bodyParser from "body-parser";
import "./database";

import express from "express";
import cors, { CorsOptions } from "cors";
import helmet from "helmet";

import validateResponse from "./middlewares/validateResponse";

// import v1 from "./apps";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json";

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
	}

	middlewares() {
		this.app.use(cors());
		this.app.use(helmet());
		this.app.use(bodyParser.urlencoded({ extended: true }));
		this.app.use(bodyParser.json());

		this.app.use(validateResponse);
	}
	routes() {
		this.app.use("/api-docs", swaggerUi.serve);
		//this.app.get("/api-docs", swaggerUi.setup(swaggerDocument));

		this.app.use("/v1", v1);
	}
}

export default new App().app;