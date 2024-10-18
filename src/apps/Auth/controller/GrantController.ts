import Grant from "../model/Grant";
import GrantDto from "../dto/GrantDto";
import { grantService, GrantService } from "../service/GrantService";
import { CustomValidationError } from "../../../error/CustomValidationError";

import { DeleteResult } from "typeorm";
import { Request, Response, NextFunction } from "express";

/**
 * Controller for handling requests related to `Grant` resources.
 */
export class GrantController {
  private readonly grantService: GrantService;

  /**
   * Initializes a new instance of the `GrantController` class.
   *
   * @param grantService - The service instance responsible for handling `Grant` business logic.
   */
  constructor(grantService: GrantService) {
    this.grantService = grantService;
  }

  /**
   * Handles POST requests to create a new `Grant`.
   *
   * @param req - The HTTP request object, containing the new `Grant` data in its body.
   * @param res - The HTTP response object used to send the newly created `Grant` entity in JSON format.
   * @param next - The next middleware function in the stack, used for error handling.
   *
   * @returns A `Response` object with status 201 and the newly created `Grant` entity in JSON format, 
   * or calls the `next` middleware with an error if validation fails or an error occurs.
   */
  public post = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { name, note, routeFilter, route } = req.body;
      const grantDto = new GrantDto(name, note, routeFilter, route);

      if (!grantDto.isValid())
        throw new CustomValidationError('All fields of the new grant must be non-null or different of "" .');

      const newGrant: Grant = await this.grantService.save(grantDto);

      return res.status(201).json(newGrant);

    } catch (error: any) {
      next(error);
    }
  }

 /**
  * Handles GET requests to retrieve a `Grant` entity by its name.
  *
  * @param req - The HTTP request object, which should contain the `route` parameter in its route parameters.
  * @param res - The HTTP response object used to send the response back to the client.
  * @param next - The next middleware function in the Express.js stack, used to handle errors.
  *
  * @returns A `Response` object with status 200 and the `Grant` entity in JSON format if found, 
  * or calls the `next` middleware with an error if the `Grant` is not found or an error occurs.
 */
  public get = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { route } = req.params;
      const grant: Grant | null = await this.grantService.findOne({ route });

      if (!grant)
        throw new CustomValidationError(`Grant ${route} not found.`);

      return res.status(200).json(grant);

    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Handles GET requests to retrieve a `Grant` entity by its ID.
   *
   * @param req - The HTTP request object, which should contain the `id` parameter in its route parameters.
   * @param res - The HTTP response object used to send the `Grant` entity in JSON format if found.
   * @param next - The next middleware function in the Express.js stack, used to handle errors.
   *
   * @returns A `Response` object with status 200 and the `Grant` entity in JSON format if found, 
   * or calls the `next` middleware with an error if the `Grant` is not found or an error occurs.
   */
  public getById = async ( req: Request, res: Response, next: NextFunction): Promise<Response | void> =>{
    try {
      const { id } = req.params;
      const grant: Grant | null = await this.grantService.findOneById(id);

      if (!grant)
        throw new CustomValidationError(`Grant with ID ${id} not found.`);

      return res.status(200).json(grant);

    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Handles GET requests to retrieve all `Grant` entities.
   *
   * @param req - The HTTP request object.
   * @param res - The HTTP response object used to send a list of all `Grant` entities in JSON format.
   * @param next - The next middleware function in the stack, used for error handling.
   *
   * @returns A `Response` object with status 200 and a list of all `Grant` entities in JSON format, 
   * or calls the `next` middleware with an error if no grants are found or an error occurs.
   */
  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>{
    try {
      const grants: Grant[] | null = await this.grantService.findAll();

      if(!grants) 
        throw new CustomValidationError("No grants found.");

      return res.status(200).json(grants);

    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Handles PUT requests to update an existing `Grant`.
   *
   * @param req - The HTTP request object, containing the updated `Grant` data in its body and the `id` in its route parameters.
   * @param res - The HTTP response object used to send the updated `Grant` entity in JSON format.
   * @param next - The next middleware function in the stack, used for error handling.
   *
   * @returns A `Response` object with status 200 and the updated `Grant` entity in JSON format, 
   * or calls the `next` middleware with an error if validation fails or an error occurs.
  */
  public put = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const { name, note, routeFilter, route } = req.body;
      const grantDto = new GrantDto(name, note, routeFilter, route);

      if(!grantDto.isValid())
        throw new CustomValidationError('All fields of the grant must be non-null or different of \"\".');

      let grantToUpdate: Grant = grantDto.toGrant();
      grantToUpdate.id = id;

      grantToUpdate = await this.grantService.update(grantToUpdate.id, grantToUpdate);
      return res.status(200).json(grantToUpdate);

    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Handles DELETE requests to remove a `Grant` by its ID.
   *
   * @param req - The HTTP request object, which should contain the `id` parameter in its route parameters.
   * @param res - The HTTP response object used to confirm the deletion.
   * @param next - The next middleware function in the stack, used for error handling.
   *
   * @returns A `Response` object with status 200 if the deletion was successful, 
   * or calls the `next` middleware with an error if the `Grant` was not found or an error occurs.
   */
  public deleteById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const deleted: DeleteResult = await this.grantService.delete(id);

      if (deleted.affected === 0)
        throw new CustomValidationError(`Grant with ID ${id} not found.`);

      return res.status(200).send();
    } catch (error: any) {
      next(error);
    }
  }

  public postProfile = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { id: grant_id } = req.params;
      const { profile_id } = req.body;
      const grant: Grant = await this.grantService.addProfileToGrant(grant_id, profile_id);

      return res.status(201).json(grant);
    } catch (error: any) {
      next(error);
    }
  }
}

// Initialize the controller with the service instance and export it
export const grantController: GrantController = new GrantController(grantService);