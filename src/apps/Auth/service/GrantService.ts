import Grant from "../model/Grant";
import GrantDto from "../dto/GrantDto";
import CustomValidationError from "../error/CustomValidationError";

import { DeleteResult, Repository } from "typeorm";

export default class GrantService {

    private grantRepository: Repository<Grant>;

    constructor(grantRepository: Repository<Grant>) {
        this.grantRepository = grantRepository;
    }

    async save(grantDto: GrantDto): Promise<Grant> {
        const now: Date = new Date();
        const newGrant: Grant = new Grant(grantDto.getName(), grantDto.getNote(), grantDto.getRoute(), grantDto.getRouteFilter(), now, now);
        
        return this.grantRepository.save(newGrant);
    }

    async findOneByName(name: string): Promise<Grant | null> {
        return await this.grantRepository.findOne({
            where: { name: name },
        });        
    }

    async findOneById(id: string): Promise<Grant | null> {
        return await this.grantRepository.findOne({
            where: { id: id },
        });        
    }
    
    async findAll(): Promise<Grant[] | null> {
        return await this.grantRepository.find();
    }
    
    async delete(name: string): Promise<DeleteResult> {
        const grantToDelete = await this.grantRepository.findOneBy({ name });
        
        if (!grantToDelete) {
            throw new CustomValidationError(`Permissão com nome ${name} não encontrada.`, 400);
        }

        return await this.grantRepository.delete({ name });
    }
}