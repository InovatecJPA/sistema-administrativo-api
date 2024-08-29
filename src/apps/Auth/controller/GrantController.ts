import Grant from "../model/Grant";
import GrantDto from "../dto/GrantDto";
import { grantService } from "../service/GrantService";
import CustomValidationError from "../error/CustomValidationError";

import { DeleteResult } from "typeorm";
import { Request, Response, NextFunction } from "express";

/**
 * Controller for handling requests related to `Grant` resources.
 */
export class GrantController {
    private grantService: GrantService;

    /**
     * Initializes a new instance of the `GrantController` class.
     * 
     * @param grantService - The service instance to handle `Grant` business logic.
     */
    constructor(grantService: GrantService) {
        this.grantService = grantService;
    }

    /**
     * Handles POST requests to create a new `Grant`.
     * 
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     * @param next - The next middleware function in the stack.
     * 
     * @returns The created `Grant` entity or calls the next middleware with an error.
     */
    async post(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { name, note, routeFilter, route } = req.body;
            const grantDto = new GrantDto(name, note, routeFilter, route);

            if (!grantDto.isValid())
                throw new CustomValidationError("All fields of the new permission must be non-null or \"\".", 400);

            const newGrant: Grant = await this.grantService.save(grantDto);

            return res.status(201).json(newGrant);

        } catch (error: any) {
            next(error);
        }
    }

    /**
     * Handles GET requests to retrieve a `Grant` by its name.
     * 
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     * @param next - The next middleware function in the stack.
     * 
     * @returns The `Grant` entity with the specified name or calls the next middleware with an error.
     */
    async get(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { name } = req.params;
            const grant: Grant | null = await this.grantService.findOne({ name });

            if (!grant)
                throw new CustomValidationError(`Permission ${name} not found.`, 400);

            return res.status(200).json(grant);

        } catch (error: any) {
            next(error);
        }
    }

    /**
     * Handles GET requests to retrieve a `Grant` by its ID.
     * 
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     * @param next - The next middleware function in the stack.
     * 
     * @returns The `Grant` entity with the specified ID or calls the next middleware with an error.
     */
    async getById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { id } = req.params;
            const grant: Grant | null = await this.grantService.findOneById(id);

            if (!grant)
                throw new CustomValidationError(`Permission with ID ${id} not found.`, 400);

            return res.status(200).json(grant);

        } catch (error: any) {
            next(error);
        }
    }

    /**
     * Handles GET requests to retrieve all `Grant` entities.
     * 
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     * @param next - The next middleware function in the stack.
     * 
     * @returns A list of all `Grant` entities or calls the next middleware with an error.
     */
    async getAll(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const grants: Grant[] | null = await this.grantService.findAll();

            if (!grants)
                throw new CustomValidationError("No permissions found.", 400);

            return res.status(200).json(grants);

        } catch (error: any) {
            next(error);
        }
    }

    /**
     * Handles PUT requests to update a `Grant`.
     * 
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     * @param next - The next middleware function in the stack.
     * 
     * @returns The updated `Grant` entity or calls the next middleware with an error.
     */
    async put(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { id } = req.params;
            const { name, note, routeFilter, route } = req.body;
            const grantDto = new GrantDto(name, note, routeFilter, route);

            if (!grantDto.isValid())
                throw new CustomValidationError("All fields of the permission must be non-null or \"\".", 400);

            let updatedGrant: Grant = grantDto.toGrant();
            updatedGrant.id = id;

            updatedGrant = await this.grantService.save(grantDto);
            return res.status(200).json(updatedGrant);

        } catch (error: any) {
            next(error);
        }
    }

    /**
     * Handles DELETE requests to remove a `Grant` by its ID.
     * 
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     * @param next - The next middleware function in the stack.
     * 
     * @returns Status 200 if the deletion was successful or calls the next middleware with an error.
     */
    async delete(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { id } = req.params;
            const deleted: DeleteResult = await this.grantService.delete(id);

            if (deleted.affected === 0)
                throw new CustomValidationError(`Permission with ID ${id} not found.`, 400);

            return res.status(200).send();
        } catch (error: any) {
            next(error);
        }
    }
}

// Initialize the controller with the service instance and export it
const grantController = new GrantController(grantService);
export default grantController;