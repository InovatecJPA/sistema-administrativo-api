import Grant from "../model/Grant";
import GrantDto from "../dto/GrantDto";
import GrantService from "../service/GrantService";
import CustomValidationError from "../error/CustomValidationError";

import { DeleteResult } from "typeorm";
import { Request, Response, NextFunction } from "express";

export default class GrantController {
    private grantService: GrantService;

    constructor(grantService: GrantService) {
        this.grantService = grantService;
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try{
            const { name, note, routeFilter, route } = req.body;
            const grantDto = new GrantDto(name, note, routeFilter, route);
            
            if (!grantDto.isValid())
                throw new CustomValidationError("Todos os campos da nova permissão devem ser diferentes de nulo ou \"\".", 400);
            
            const newGrant: Grant = await this.grantService.save(grantDto);

            return res.status(201).json(newGrant);

        } catch(error: any) {
            next(error);
        }
    }

    async get(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { name } = req.params;
            const grant: Grant | null = await this.grantService.findOneByName(name);

            if (!grant)
                throw new CustomValidationError(`Permissão ${name} não encontrada.`, 400);

            return res.status(200).json(grant);

        } catch(error: any) {
            next(error);
        }        
    }
    
    async getAll(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const grants: Grant[] | null = await this.grantService.findAll();

            if (!grants)
                throw new CustomValidationError("Nenhuma permissão encontrada.", 400);

            return res.status(200).json(grants);

        } catch(error: any) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { id } = req.params;
            const { name, note, routeFilter, route } = req.body;
            const grantDto = new GrantDto(name, note, routeFilter, route);
            
            if (!grantDto.isValid())
                throw new CustomValidationError("Todos os campos da permissão devem ser diferentes de nulo ou \"\".", 400);
            
            let updatedGrant: Grant = grantDto.toGrant();
            updatedGrant.id = id;
            
            updatedGrant = await this.grantService.save(grantDto);
            return res.status(200).json(updatedGrant);

        } catch(error: any) {
            next(error);
        }
    }
    
    async delete(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { id } = req.params;
            const deleted:DeleteResult = await this.grantService.delete(id);
            if (deleted.affected === 0)
                throw new CustomValidationError(`Permissão com id ${id} não encontrada.`, 400);

            return res.status(200).send();
        } catch(error: any) {
            next(error);
        }
    }
}