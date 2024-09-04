import { Request, Response } from "express";
import { ProfileService } from "../service/ProfileService";
import ProfileDto from "../dto/ProfileDto";
import { CustomValidationError } from "../../../error/CustomValidationError";

// Create an instance of ProfileService

class ProfileController {
  private profileService: ProfileService;

  /**
   * Seed profiles and grants into the database.
   *
   * @param req - The HTTP request object.
   * @param res - The HTTP response object.
   * @returns A JSON response indicating success.
   */
  async store(req: Request, res: Response): Promise<Response> {
    try {
      // Seed profiles
      await this.profileService.save(new ProfileDto(
        'diretor_presidente',
        'Administrador geral',
        true
      ));
      await profileService.save(new ProfileDto(
        'diretor_juridico',
        'Administrador geral juridico',
        true
      ));
      // Add more profiles as needed

      // Seed grants
      // Note: You will need to implement a GrantService similarly to ProfileService
      // and use it to seed grants.

      return res.json({ message: 'Sucesso' });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  /**
   * Retrieve all profiles from the database.
   *
   * @param req - The HTTP request object.
   * @param res - The HTTP response object.
   * @returns A JSON response containing all profiles.
   */
  async index(req: Request, res: Response): Promise<Response> {
    try {
      const profiles = await profileService.findAll();
      return res.json(profiles);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  /**
   * Retrieve a single profile by its ID.
   *
   * @param req - The HTTP request object.
   * @param res - The HTTP response object.
   * @returns A JSON response containing the profile details.
   */
  async show(req: Request, res: Response): Promise<Response> {
    try {
      const profile = await profileService.findOneById(req.params.id);

      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      const { id, name, isAdmin } = profile;
      return res.json({ id, name, isAdmin });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  /**
   * Update a profile by its ID.
   *
   * @param req - The HTTP request object.
   * @param res - The HTTP response object.
   * @returns A JSON response containing the updated profile details.
   */
  async update(req: Request, res: Response): Promise<Response> {
    try {
      const profile = await profileService.findOneById(req.params.id);

      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      const updatedProfile = await profileService.update(req.params.id, req.body);

      const { id, name, isAdmin } = updatedProfile;
      return res.json({ id, name, isAdmin });
    } catch (e) {
      return res.status(400).json({ errors: e.errors?.map((err: Error) => err.message) || [e.message] });
    }
  }

  /**
   * Delete a profile by its ID.
   *
   * @param req - The HTTP request object.
   * @param res - The HTTP response object.
   * @returns A JSON response indicating success or failure.
   */
  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const result = await profileService.delete(req.params.id);

      if (result.affected === 0) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      return res.json({ message: 'Profile deleted successfully' });
    } catch (e) {
      return res.status(400).json({ errors: e.errors?.map((err: Error) => err.message) || [e.message] });
    }
  }
}

export default new ProfileController();
