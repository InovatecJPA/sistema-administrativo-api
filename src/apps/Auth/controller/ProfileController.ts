import { CustomValidationError } from "../../../error/CustomValidationError";
import { NotFoundError } from "../../../error/NotFoundError";
import ProfileDto from "../dto/ProfileDto";
import Profile from "../model/Profile";
import { profileService, ProfileService } from "../service/ProfileService";

import { NextFunction, Request, Response } from "express";

export class ProfileController {
  private profileService: ProfileService;

  constructor(profileService: ProfileService) {
    this.profileService = profileService;
  }

  /**
   * Create default profiles and save them to the database.
   *
   * @param req - The HTTP request object.
   * @param res - The HTTP response object.
   * @param next - The next middleware function.
   * @returns A JSON response indicating success or passes errors to the next middleware.
   */
  async createProfiles(res: Response, next: NextFunction): Promise<Response> {
    const profiles = {
      admin: 'Administrador do sistema',
      administrativo: 'Setor administrativo da empresa',
    };

    try {
      for (const [key, value] of Object.entries(profiles)) {
        await this.profileService.save(new ProfileDto(key, value));
      }
      return res.status(200).json({ message: 'All profiles seeded successfully' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Seed profiles into the database.
   *
   * @param req - The HTTP request object.
   * @param res - The HTTP response object.
   * @param next - The next middleware function.
   * @returns A JSON response indicating success or passes errors to the next middleware.
   */
  public store = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await Promise.all([
        this.createProfiles(res, next),
      ]);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles POST requests to create a new `Profile`.
   *
   * @param req - The HTTP request object, containing the new `Profile` data in its body.
   * @param res - The HTTP response object used to send the newly created `Profile` entity in JSON format.
   * @param next - The next middleware function in the stack, used for error handling.
   *
   * @returns A `Response` object with status 201 and the newly created `Profile` entity in JSON format, 
   * or calls the `next` middleware with an error if validation fails or an error occurs.
   */
  public post = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { name, description, users, associatedGrants } = req.body;
      const profileDto = new ProfileDto(name, description, users, associatedGrants);

      if (!profileDto.isValid())
        throw new CustomValidationError('All fields of the new profile must be non-null or different of "" .');

      const newProfile: Profile = await this.profileService.save(profileDto);

      return res.status(201).json(newProfile);

    } catch (error: any) {
      next(error);
    }
  }

  /**
  * Handles GET requests to retrieve a `Profile` entity by its name.
  *
  * @param req - The HTTP request object, which should contain the `route` parameter in its route parameters.
  * @param res - The HTTP response object used to send the response back to the client.
  * @param next - The next middleware function in the Express.js stack, used to handle errors.
  *
  * @returns A `Response` object with status 200 and the `Profile` entity in JSON format if found, 
  * or calls the `next` middleware with an error if the `Profile` is not found or an error occurs.
 */
  public get = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { name } = req.body;
      const profile: Profile | null = await this.profileService.findOne({ name });

      if (!profile)
        throw new CustomValidationError(`Profile ${name} not found.`);

      return res.status(200).json(profile);

    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Retrieve all profiles from the database.
   *
   * @param req - The HTTP request object.
   * @param res - The HTTP response object.
   * @param next - The next middleware function.
   * @returns A JSON response containing all profiles or passes errors to the next middleware.
   */
  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      const profiles = await this.profileService.findAll();
      return res.json(profiles);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve a single profile by its ID.
   *
   * @param req - The HTTP request object.
   * @param res - The HTTP response object.
   * @param next - The next middleware function.
   * @returns A JSON response containing the profile details or passes errors to the next middleware.
   */
  public getById = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      const profile = await this.profileService.findOneById(req.params.id);

      if (!profile) {
        throw new NotFoundError(`Profile with ID ${req.params.id} not found.`);
      }

      return res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles PUT requests to update an existing `Profile`.
   *
   * @param req - The HTTP request object, containing the updated `Profile` data in its body and the `id` in its route parameters.
   * @param res - The HTTP response object used to send the updated `Profile` entity in JSON format.
   * @param next - The next middleware function in the stack, used for error handling.
   *
   * @returns A `Response` object with status 200 and the updated `Profile` entity in JSON format, 
   * or calls the `next` middleware with an error if validation fails or an error occurs.
  */
  public put = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      const profile = await this.profileService.findOneById(req.params.id);

      if (!profile) {
        throw new NotFoundError(`Profile with ID ${req.params.id} not found.`);
      }

      const updatedProfile = await this.profileService.update(
        req.params.id,
        req.body
      );

      return res.json(updatedProfile);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a profile by its ID.
   *
   * @param req - The HTTP request object.
   * @param res - The HTTP response object.
   * @param next - The next middleware function.
   * @returns A JSON response indicating success or failure or passes errors to the next middleware.
   */
  public deleteById = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      const result = await this.profileService.delete(req.params.id);

      if (result.affected === 0) {
        throw new NotFoundError(`Profile with ID ${req.params.id} not found.`);
      }

      return res.json({ message: "Profile deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export default new ProfileController(profileService);
