import { Repository } from "typeorm";
import Grant from "../model/Grant";
import GrantDto from "../dto/GrantDTO";
import { Request, Response, NextFunction } from "express";
import CustomValidationError from "../error/CustomValidationError";

export default class GrantController {
    private grantRepository: Repository<Grant>;

    constructor(grantRepository: Repository<User>) {
        this.grantRepository = grantRepository;
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try{
            const { grant, note, routeFilter, route } = req.body;
            const grantDto = new GrantDto(grant, note, routeFilter, route);
            
            if (!grantDto.isValid())
                throw new CustomValidationError("Todos os campos da nova permissão devem ser diferentes de nulo ou \"\".", 400);
            
            const newGrant: Grant = new Grant(grantDto.getGrant(), grantDto.getNote(), grantDto.getRoute(), grantDto.getRouteFilter(), Date.now(), Date.now())
            this.grantRepository.save(newGrant);

        } catch(error: any) {
            next(error);
        }
    }

    async get(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        
    }
    
    async getAll(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<Response | void> {

    }
    
    async delete(req: Request, res: Response, next: NextFunction): Promise<Response | void> {

    }
}