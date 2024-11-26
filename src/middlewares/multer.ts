import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import path from "path";

// // Configuração do armazenamento no disco, lembrar de criar a pasta para que os arquivos sejam armazenados
// const uploadDir = path.resolve(__dirname, "uploads");
// console.log(uploadDir);

// const storage = multer.diskStorage({
//     destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
//       cb(null, uploadDir); // Pasta para armazenar os arquivos
//     },
//     filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
//       cb(null, `${Date.now()}-${file.originalname}`);
//     },
//   });

// Configuração do armazenamento para armazenar o arquivo em memória
const storage = multer.memoryStorage();
  
// Filtro para validar os tipos de arquivos
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Invalid file type"));
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

export default upload;
