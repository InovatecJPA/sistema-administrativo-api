import { Router } from "express";
import { sectorController } from "../controller/SectorController"; // ajuste o caminho conforme necessário

const router: Router = Router();

// Criar um novo setor
router.post("/", sectorController.post);

// Obter um setor pelo ID
router.get("/:id", sectorController.getById);

// Obter todos os setores
router.get("/", sectorController.getAll);

// Atualizar um setor pelo ID
router.put("/:id", sectorController.put);

// Excluir um setor pelo ID
router.delete("/:id", sectorController.deleteById);

export default router;
