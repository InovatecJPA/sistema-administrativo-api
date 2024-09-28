import Sector from "../model/Sector";
import { SectorDTO } from "../dto/sector.dto";
import { sectorService, SectorService } from "../service/SectorService";
import { CustomValidationError } from "../../../error/CustomValidationError";
import { Request, Response, NextFunction } from "express";

export class SectorController {
    private readonly sectorService: SectorService;

    constructor(sectorService: SectorService) {
        this.sectorService = sectorService;
    }

    public post = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { name, description } = req.body;
            const sectorDto: SectorDTO = { name}; // DTO sem ID
    
            // Verificação de validade
            if (!sectorDto.name) {
                throw new CustomValidationError('The name of the sector is required.');
            }
    
            // Criar um novo setor a partir do DTO
            const newSector: Sector = new Sector(); // Cria uma nova instância de Sector
            newSector.name = sectorDto.name;
           
    
            const savedSector: Sector = await this.sectorService.save(newSector);
    
            return res.status(201).json(savedSector);
        } catch (error: any) {
            next(error);
        }
    }
    

    public getById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { id } = req.params;
            const sector: Sector | null = await this.sectorService.findOneById(id);

            if (!sector) {
                throw new CustomValidationError(`Sector with ID ${id} not found.`);
            }

            return res.status(200).json(sector);
        } catch (error: any) {
            next(error);
        }
    }

    public getAll = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const sectors: Sector[] = await this.sectorService.findAll();
            if (!sectors.length) {
                throw new CustomValidationError("No sectors found.");
            }

            return res.status(200).json(sectors);
        } catch (error: any) {
            next(error);
        }
    }

    public put = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { id } = req.params;
            const { name, description } = req.body;
            const sectorDto: SectorDTO = { name}; // DTO sem ID

            // Verificação de validade
            if (!sectorDto.name) {
                throw new CustomValidationError('The name of the sector is required.');
            }

            // Obter o setor atual do banco de dados
            const existingSector: Sector | null = await this.sectorService.findOneById(id);
            if (!existingSector) {
                throw new CustomValidationError(`Sector with ID ${id} not found.`);
            }

            // Atualizar o setor existente
            const updatedSector: Sector = {
                ...existingSector,
                ...sectorDto,
                users: existingSector.users // Mantém os usuários existentes
            };

            const savedSector: Sector = await this.sectorService.updateSector(updatedSector);
            return res.status(200).json(savedSector);
        } catch (error: any) {
            next(error);
        }
    }

    public deleteById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { id } = req.params;
            const deletedSector: Sector = await this.sectorService.delete(id);
            return res.status(200).json(deletedSector); // Returns the deleted sector
        } catch (error: any) {
            next(error);
        }
    }
}

export const sectorController: SectorController = new SectorController(sectorService);
