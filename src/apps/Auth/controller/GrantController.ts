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
  * Create default grants and save them to the database.
  *
  * @param req - The HTTP request object.
  * @param res - The HTTP response object.
  * @param next - The next middleware function.
  * @returns A JSON response indicating success or passes errors to the next middleware.
  */
  async createGrants(res: Response, next: NextFunction): Promise<Response> {
    const grants = [
    // Grants para as rotas de autenticação
      { grant: 'post', route: '/v1/accounts/user/singUp', note: 'Cria um novo usuário no sistema.' },
      { grant: 'post', route: '/v1/accounts/user/login', note: 'Autentica um usuário com email e senha.' },
      { grant: 'post', route: '/v1/accounts/user/forgotPassword', note: 'Inicia o processo de redefinição de senha.' },
      { grant: 'post', route: '/v1/accounts/user/resetPassword/:token', note: 'Redefine a senha de um usuário usando um token.' },
      { grant: 'patch', route: '/v1/accounts/user/changePassword', note: 'Permite que um usuário autenticado mude sua senha.' },

      // Rotas de usuario
      { grant: 'get', route: '/v1/user', note: 'Detalhes do usuário logado' },
      { grant: 'get', route: '/v1/user/list', note: 'Lista todos os usuários' },
      { grant: 'get', route: '/v1/user/listAll', note: 'Lista todos os usuários' },
      { grant: 'patch', route: '/v1/user/:id/update', note: 'Atualiza um usuário' },
      { grant: 'put', route: '/v1/user/:id/update/profile', note: 'Atualiza o perfil do usuário' },
      { grant: 'delete', route: '/v1/user/:id', note: 'Apaga um usuário' },

      // Rotas de perfil
      { grant: 'post', route: '/v1/profile/post', note: 'Cria um novo perfil' },
      { grant: 'get', route: '/v1/profile/getByName', note: 'Recupera perfil pelo nome' },
      { grant: 'get', route: '/v1/profile/getById/:id', note: 'Recupera perfil pelo ID' },
      { grant: 'get', route: '/v1/profile/getAll', note: 'Recupera todos os perfis' },
      { grant: 'put', route: '/v1/profile/put/:id', note: 'Atualiza perfil pelo ID' },
      { grant: 'delete', route: '/v1/profile/delete/:id', note: 'Deleta perfil pelo ID' },

      // Rotas de grant
      { grant: 'post', route: '/v1/grant/post', note: 'Cria um novo grant' },
      { grant: 'get', route: '/v1/grant/getById/:id', note: 'Recupera grant pelo ID' },
      { grant: 'get', route: '/v1/grant/getAll', note: 'Recupera todos os grants' },
      { grant: 'put', route: '/v1/grant/put/:id', note: 'Atualiza grant pelo ID' },
      { grant: 'delete', route: '/v1/grant/delete/:id', note: 'Deleta grant pelo ID' },
      { grant: 'post', route: '/v1/grant/:id/postProfile', note: 'Adiciona perfil a um grant' },
      { grant: 'post', route: '/v1/grant/:id/postSector', note: 'Adiciona setor a um grant' },

      // Rotas de requisições de projeto
      { grant: 'post', route: '/v1/projectsRequest/post', note: 'Cria uma nova requisição de projeto' },
      { grant: 'get', route: '/v1/projectsRequest/getById/:id', note: 'Recupera requisição de projeto pelo ID' },
      { grant: 'get', route: '/v1/projectsRequest/getAll', note: 'Recupera todas as requisições de projeto' },
      { grant: 'put', route: '/v1/projectsRequest/put/:id', note: 'Atualiza requisição de projeto pelo ID' },
      { grant: 'delete', route: '/v1/projectsRequest/delete/:id', note: 'Deleta requisição de projeto pelo ID' },

      // Rotas de projeto
      { grant: 'post', route: '/v1/projects/post', note: 'Cria um novo projeto' },
      { grant: 'get', route: '/v1/projects/getById/:id', note: 'Recupera projeto pelo ID' },
      { grant: 'get', route: '/v1/projects/getAll', note: 'Recupera todos os projetos' },
      { grant: 'put', route: '/v1/projects/put/:id', note: 'Atualiza projeto pelo ID' },
      { grant: 'delete', route: '/v1/projects/delete/:id', note: 'Deleta projeto pelo ID' },
      { grant: 'post', route: '/v1/projects/:id/coordinators', note: 'Adiciona um coordenador a um projeto' },
      { grant: 'delete', route: '/v1/projects/:id/coordinators', note: 'Remove um coordenador de um projeto' },
      { grant: 'get', route: '/v1/projects/coordinator/:id', note: 'Recupera projetos por coordenador' },
      { grant: 'post', route: '/v1/projects/:id/members', note: 'Adiciona um membro a um projeto' },
      { grant: 'delete', route: '/v1/projects/:id/members', note: 'Remove um membro de um projeto' },
      { grant: 'get', route: '/v1/projects/member/:id', note: 'Recupera projetos por membro' },
      { grant: 'post', route: '/v1/projects/:id/sectors', note: 'Adiciona um setor a um projeto' },
      { grant: 'delete', route: '/v1/projects/:id/sectors', note: 'Remove um setor de um projeto' },

      // Rotas de setor
      { grant: 'post', route: '/v1/sector/post', note: 'Cria um novo setor' },
      { grant: 'get', route: '/v1/sector/getById/:id', note: 'Recupera setor pelo ID' },
      { grant: 'get', route: '/v1/sector/getAll', note: 'Recupera todos os setores' },
      { grant: 'put', route: '/v1/sector/put/:id', note: 'Atualiza setor pelo ID' },
      { grant: 'delete', route: '/v1/sector/delete/:id', note: 'Deleta setor pelo ID' },
      { grant: 'post', route: '/v1/sector/:id/postUser', note: 'Adiciona usuário a um setor' },
      { grant: 'delete', route: '/v1/sector/:id/deleteUser', note: 'Remove usuário de um setor' },
      { grant: 'post', route: '/v1/sector/:id/postMessage', note: 'Adiciona mensagem a um setor' },
      { grant: 'delete', route: '/v1/sector/:id/deleteMessage', note: 'Remove mensagem de um setor' },
    ];

    try {
      for (const grant of grants) {
        await this.grantService.save(new GrantDto(grant.grant, grant.note, grant.route,));
      }
      return res.status(200).json({ message: 'All grants seeded successfully' });
    } catch (error) {
      next(error);
    }
  }

    /**
   * Seed grants into the database.
   *
   * @param req - The HTTGrantControllerP request object.
   * @param res - The HTTP response object.
   * @param next - The next middleware function.
   * @returns A JSON response indicating success or passes errors to the next middleware.
   */
  public store = async (res: Response, next: NextFunction): Promise<void> => {
    try {
      await Promise.all([
        this.createGrants(res, next)
      ]);
    } catch (error) {
      next(error);
    }
  };

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
      const { name, note,  route } = req.body;
      const grantDto = new GrantDto(name, note,  route);

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
      const { name, note, route } = req.body;
      const grantDto = new GrantDto(name, note, route);

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

  public postSector = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { id: grant_id } = req.params;
      const { service_id } = req.body;
      const grant: Grant = await this.grantService.addSectorToGrant(grant_id, service_id);

      return res.status(201).json(grant);
    } catch (error: any) {
      next(error);
    }
  }
}

// Initialize the controller with the service instance and export it
export const grantController: GrantController = new GrantController(grantService);