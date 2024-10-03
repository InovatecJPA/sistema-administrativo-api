import dotenv from "dotenv";
import app from "./app";
import os from "os";

const envFile =
	process.env.NODE_ENV === "development" ? ".env.development" : ".env.deploy";
dotenv.config({ path: envFile });

const port = process.env.APP_PORT;
app.listen(port);

const getLocalIP = (): string => {
  const interfaces = os.networkInterfaces();
  for (const iface in interfaces) {
    for (const alias of interfaces[iface]!) {
      if (alias.family === "IPv4" && !alias.internal) {
        return alias.address; // Retorna o primeiro endereço IP encontrado
      }
    }
  }
  return "127.0.0.1"; // Retorno padrão se não encontrar um IP válido
};

console.log("IP da rede local:", getLocalIP());

console.log(`Running in ${process.env.NODE_ENV} mode`);
console.log(`Server running on port ${port}`);
