import express, { Request, Response, Application, NextFunction } from "express";

import cors, { CorsOptions } from "cors";
import helmet from "helmet";

import validateResponse from "./middlewares/setCORS";
import dbConnection from "./database/dbConnection";
import { errorsHandler } from "./middlewares/errorsHandler";

import v1 from "./apps";
import ProfileController from "./apps/Auth/controller/ProfileController";
import { GrantController } from "./apps/Auth/controller/GrantController";
// import swaggerUi from "swagger-ui-express";
// import swaggerDocument from "../swagger.json";

// Temp. desenvolvimento das rotas

const whiteList = ["http://localhost:3010", "http://localhost:3000"];

const corsOptions: CorsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    console.log("Request origin:", origin); // Adicione isto para ver qual origem está sendo recebida
    if (whiteList.indexOf(origin || "") !== -1 || !origin) {
      //console.log("Allowed by CORS");
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
    this.errorHandling();
    ProfileController.createProfiles;
    GrantController.createGrants;
  }

  middlewares(): void {
    this.app.use(cors(corsOptions));
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(validateResponse);
  }

  routes(): void {
    // Dev-back routes
    //this.app.use("/dev", devRoutes);

    //this.app.use("/api-docs", swaggerUi.serve);
    //this.app.get("/api-docs", swaggerUi.setup(swaggerDocument));

    this.app.use("/v1", v1);
    this.app.get("/testDB", async (req: Request, res: Response) => {
      try {
        // Verifica se a conexão já está inicializada
        if (!dbConnection.isInitialized) {
          await dbConnection.initialize();
        }

        res.send("Connected to database");
        const entities = dbConnection.entityMetadatas.map(
          (entity) => entity.name
        );
        console.log("Entidades registradas:", entities);

        // Listar migrações encontradas
        const migrations = dbConnection.migrations.map(
          (migration) => migration.name
        );
        console.log("Migrações encontradas:", migrations);
      } catch (error) {
        console.error("Error connecting to database:", error);
        res.status(500).send("Error connecting to database");
      }
    });
  }

  private errorHandling(): void {
    this.app.use(errorsHandler);
  }
}

export default new App().app;
