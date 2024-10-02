import { NextFunction, Request, Response } from "express";
import { CustomValidationError } from "../../../error/CustomValidationError";
import { NotFoundError } from "../../../error/NotFoundError";
import SectorDto from "../dto/SectorDto";
import Sector from "../model/Sector";
import { sectorService, SectorService } from "../service/SectorService";

export class SectorController {
  private readonly sectorService: SectorService;

  constructor(sectorService: SectorService) {
    this.sectorService = sectorService;
  }

  /**
   * Handles POST request to create a new sector.
   */
  public post = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { name, description } = req.body;
      const sectorDto: SectorDto = new SectorDto(name, description);

      if (!sectorDto.isValid()) {
        throw new CustomValidationError(
          "The name of the sector and the description are required."
        );
      }

      const savedSector: Sector = await this.sectorService.save(
        sectorDto.toSector()
      );

      return res.status(201).json(savedSector);
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Handles GET request to find a sector by its ID.
   */
  public getById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const sector: Sector = await this.sectorService.findOneById(id);

      return res.status(200).json(sector);
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Handles GET request to retrieve all sectors.
   */
  public getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const sectors: Sector[] = await this.sectorService.findAll();
      return res.status(200).json(sectors);
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Handles PUT request to update a sector by its ID.
   */
  public put = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { name, description } = req.body;
      const sectorDto: SectorDto = new SectorDto(name, description);

      if (!sectorDto.isValid()) {
        throw new CustomValidationError(
          "The name of the sector and the description are required."
        );
      }

      const updatedSector: Sector = await this.sectorService.update(
        req.params.id,
        req.body
      );

      return res.status(200).json(updatedSector);
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Handles DELETE request to remove a sector by its ID.
   */
  public deleteById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const result = await this.sectorService.delete(req.params.id);

      if (result.affected === 0) {
        throw new NotFoundError(`Sector with ID ${req.params.id} not found.`);
      }

      return res.json({ message: "Sector deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
}

// Initialize the controller with the service
export default new SectorController(sectorService);
