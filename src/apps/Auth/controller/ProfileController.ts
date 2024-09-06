import { NotFoundError } from "../../../error/NotFoundError";
import GrantDto from "../dto/GrantDto";
import ProfileDto from "../dto/ProfileDto";
import { GrantService } from "../service/GrantService";
import { ProfileService } from "../service/ProfileService";

import { NextFunction, Request, Response } from "express";

export class ProfileController {
  private profileService: ProfileService;
  private grantService: GrantService;

  /**
   * Create default profiles and save them to the database.
   *
   * @param req - The HTTP request object.
   * @param res - The HTTP response object.
   * @param next - The next middleware function.
   * @returns A JSON response indicating success or passes errors to the next middleware.
   */
  async createProfiles(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const profiles = {
      diretor_presidente: 'Administrador geral',
      diretor_juridico: 'Administrador geral juridico',
      secretaria_geral: 'Secretaria geral',
      secretario: 'secretario',
      gerente_administrativo: 'gerente_administrativo',
      coordenador_projetos: 'coordenador_projetos',
      coordenador_TI: 'coordenador_TI'
    };

    try {
      for (const [key, value] of Object.entries(profiles)) {
        await this.profileService.save(new ProfileDto(key, value));
      }
      return res.status(200).json({ message: 'All default profiles saved successfully' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create default grants and save them to the database.
   *
   * @param req - The HTTP request object.
   * @param res - The HTTP response object.
   * @param next - The next middleware function.
   * @returns A JSON response indicating success or passes errors to the next middleware.
   */
  async createGrants(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const grants = [
      { grant: 'post', route: '/v1/accounts/Users', note: 'User comum fazer o cheking' },
      { grant: 'put', route: '/v1/accounts/Users', note: 'User comum fazer o cheking' },
      { grant: 'delete', route: '/v1/accounts/Users', note: 'User comum fazer o cheking' },
      { grant: 'get', route: '/v1/accounts/Users', note: 'User comum fazer o cheking' },
      { grant: 'get', route: '/v1/accounts/Users/AllUsers', note: 'pegar o plano do user' },
      { grant: 'post', route: '/v1/accounts/Users/RecuperarSenha', note: 'pegar o plano do user' },
      { grant: 'post', route: '/v1/accounts/Users/MudarSenha', note: 'pegar o treino' },
      { grant: 'post', route: '/v1/accounts/token/', note: 'pegar todos os treinos por cateoria' },
      { grant: 'post', route: '/v1/Processos', note: 'pegar todos os treinos por cateoria' },
      { grant: 'get', route: '/v1/Events', note: 'pegar todos os treinos por cateoria' },
      { grant: 'post', route: '/v1/Events', note: 'pegar todos os treinos por cateoria' },
      { grant: 'delete', route: '/v1/Events/:id', note: 'Criar os planos,ver todos os plano criados pelo proprio treinador' },
      { grant: 'get', route: '/v1/Events/:id', note: 'Criar os planos,ver todos os plano criados pelo proprio treinador' },
      { grant: 'update', route: '/v1/Events/:id', note: 'Criar os planos,ver todos os plano criados pelo proprio treinador' },
    ];

    try {
      for (const grant of grants) {
        await this.grantService.save(new GrantDto(grant.grant, grant.route, grant.note));
      }
      return res.status(200).json({ message: 'All default grants saved successfully' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Seed profiles and grants into the database.
   *
   * @param req - The HTTP request object.
   * @param res - The HTTP response object.
   * @param next - The next middleware function.
   * @returns A JSON response indicating success or passes errors to the next middleware.
   */
  public store = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await Promise.all([
        this.createProfiles(req, res, next),
        this.createGrants(req, res, next)
      ]);
      res.status(200).json({ message: 'All profiles and grants seeded successfully' });
    } catch (error) {
      next(error);
    }
  };

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
   * Update a profile by its ID.
   *
   * @param req - The HTTP request object.
   * @param res - The HTTP response object.
   * @param next - The next middleware function.
   * @returns A JSON response containing the updated profile details or passes errors to the next middleware.
   */
  public update = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
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
  public delete = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
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

export default new ProfileController();
