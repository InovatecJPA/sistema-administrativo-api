import Grant from "../model/Grant";
import GrantDto from "../dto/GrantDto";
import ServiceInterface from "../interface/ServiceInterface";
import CustomValidationError from "../error/CustomValidationError";

import { DeleteResult, Repository } from "typeorm";

/**
 * Service class for managing `Grant` entities.
 */
export default class GrantService implements ServiceInterface<Grant, GrantDto> {

    private grantRepository: Repository<Grant>;

    /**
     * Initializes a new instance of the `GrantService` class.
     * 
     * @param repository - The TypeORM repository for `Grant` entities.
     */
    constructor(repository: Repository<Grant>) {
        this.grantRepository = repository;
    }

    /**
     * Saves a new `Grant` entity to the database.
     * 
     * @param grantDto - The data transfer object containing the `Grant` details.
     * 
     * @returns The saved `Grant` entity.
     */
    async save(grantDto: Partial<GrantDto>): Promise<Grant> {
        const now: Date = new Date();
        const newGrant: Grant = new Grant(
            grantDto.getName(), 
            grantDto.getNote(), 
            grantDto.getRoute(), 
            grantDto.getRouteFilter(), 
            now, 
            now
        );
        
        return this.grantRepository.save(newGrant);
    }

    /**
     * Finds a `Grant` entity by partial matching of its properties.
     * 
     * @param object - Partial `Grant` object containing properties to match.
     * 
     * @returns The matched `Grant` entity or null if not found.
     */
    async findOne(object: Partial<Grant>): Promise<Grant | null> {
        return await this.grantRepository.findOne({
            where: { ...object },
        });  
    }

    /**
     * Finds a `Grant` entity by its ID.
     * 
     * @param id - The ID of the `Grant` entity to find.
     * 
     * @returns The `Grant` entity with the specified ID or null if not found.
     */
    async findOneById(id: string): Promise<Grant | null> {
        return await this.grantRepository.findOne({
            where: { id: id },
        });        
    }

    /**
     * Retrieves all `Grant` entities from the database.
     * 
     * @returns An array of all `Grant` entities or null if none found.
     */
    async findAll(): Promise<Grant[] | null> {
        return await this.grantRepository.find();
    }

    /**
     * Updates an existing `Grant` entity.
     * 
     * @param id - The ID of the `Grant` entity to update.
     * @param object - Partial `Grant` object containing updated properties.
     * 
     * @returns The updated `Grant` entity.
     */
    async update(id: string, object: Partial<Grant>): Promise<Grant> {
        return this.grantRepository.save({
            ...object,
            id: id
        });
    }
    
    /**
     * Deletes a `Grant` entity by its name.
     * 
     * @param name - The name of the `Grant` entity to delete.
     * 
     * @returns The result of the delete operation.
     * 
     * @throws CustomValidationError if no `Grant` with the specified name is found.
     */
    async delete(name: string): Promise<DeleteResult> {
        const grantToDelete = await this.grantRepository.findOneBy({ name });
        
        if (!grantToDelete) {
            throw new CustomValidationError(`Permission with name ${name} not found.`, 400);
        }

        return await this.grantRepository.delete({ name });
    }
}
