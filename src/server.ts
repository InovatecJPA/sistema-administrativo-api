import dotenv from "dotenv";
import app from "./app";

const envFile = process.env.NODE_ENV === "dev" ? ".env.dev" : ".env.deploy";
dotenv.config({ path: envFile });

const port = process.env.APP_PORT;
app.listen(port);

console.log(`Running in ${process.env.NODE_ENV} mode`);
console.log(`Server running on port ${port}`);
