import { DeleteResult, Repository } from "typeorm";

export default interface ServiceInterface<T, TDto> {
    
    /**
     * Creates a new record in the database.
     *
     * @param objectDto - A partial object of type T containing the necessary data to create the record.
     * @returns A Promise that resolves to the created object of type T.
     */
    save(objectDto: Partial<TDto>): Promise<T>;

    /**
     * Finds a single record in the database that matches the provided object properties.
     *
     * @param object - A partial object of type T with the criteria for the search.
     * @returns A Promise that resolves to the found object of type T, or `null` if no record is found.
     */
    findOne(object: Partial<T>): Promise<T | null>;

    /**
     * Finds a single record in the database by its ID.
     *
     * @param id - The ID of the record to be found.
     * @returns A Promise that resolves to the found object of type T, or `null` if no record is found.
     */
    findOneById(id: string): Promise<T | null>;

    /**
     * Retrieves all records from the database.
     *
     * @returns A Promise that resolves to an array of objects of type T, or an empty array if no records are found.
     */
    findAll(): Promise<T[]>;

    /**
     * Updates an existing record in the database.
     *
     * @param id - The ID of the record to be updated.
     * @param objectDto - A partial object of type T containing the updated data.
     * @returns A Promise that resolves to the updated object of type T.
     */
    update(id: string, object: Partial<T>): Promise<T>;

    /**
     * Deletes a record from the database by its ID.
     *
     * @param id - The ID of the record to be deleted.
     * @returns A Promise that resolves to a `DeleteResult`, indicating the outcome of the delete operation.
     */
    delete(id: string): Promise<DeleteResult>;

}
