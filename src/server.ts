import dotenv from "dotenv";

const envFile = process.env.NODE_ENV === "dev" ? ".env.dev" : ".env.deploy";
dotenv.config({ path: envFile });

const port = process.env.APP_PORT;

import app from "./app";

app.listen(port);

console.log(`Running in ${process.env.NODE_ENV} mode`);
console.log(`Server running on port ${port}`);
