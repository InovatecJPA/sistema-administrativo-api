import { NextFunction, Request, Response } from "express";
import {
  ShowUserDTO,
  UpdateUserDTO,
  updateUserSchema,
} from "../schemas/userSchemas";
import { UserService, userService } from "../service/UserService";

/**
 * Controller class for handling HTTP requests related to User operations.
 * Provides functionalities such as listing users with pagination, updating user details, updating user profile, showing user details, and deactivating users.
 */
class UserController {
  private readonly userService: UserService; // Service to handle user-related operations

  /**
   * Initializes the UserController with an instance of the UserService.
   * @param userService - Instance of UserService to perform user-related operations.
   */
  constructor(userService: UserService) {
    this.userService = userService;
  }

  /**
   * Lists users in a paginated format.
   * Responds with a paginated list of users or a not found message if no users are available for the given page.
   *
   * @param req - Express request object (query param `page` indicates the page number).
   * @param res - Express response object.
   * @param next - Express next middleware function.
   * @returns A promise that resolves to a paginated response or a 404 status if no users are found.
   */
  public listPaginated = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;

      const result = await this.userService.findAllPaginated(page);
      if (!result.listUser.length && page === 1) {
        return res.status(404).json({ error: "Nenhum usuário encontrado." });
      } else if (!result.listUser.length) {
        return res.status(404).json({ error: "Nenhum usuário nesta página." });
      }

      return res.json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Updates user details based on provided data in the request body.
   * Validates the input data using a schema and updates the user.
   *
   * @param req - Express request object containing `userInfo.id` and `body` with update data.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  // Importante reautenticar o usuário após a atualização
  public update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const updateData: UpdateUserDTO = updateUserSchema.parse(req.body);

      await this.userService.updateUser(req.userInfo.id, updateData);

      res.status(200).json({ message: "Usuário atualizado com sucesso." });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Updates the profile of a user based on `profileId` provided in the request body.
   *
   * @param req - Express request object containing `userInfo.id` and `body.profileId`.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  public updateUserProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.userInfo.id;
      const profileId = req.body.profileId;

      await this.userService.updateUserProfile(userId, profileId);

      res.status(200).json({ message: "Perfil atualizado com sucesso." });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieves detailed information for a user based on the `userInfo.id` from the request.
   *
   * @param req - Express request object containing `userInfo.id`.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   * @returns A promise that resolves to an object containing user details or throws an error if the user is not found.
   */
  public show = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const userId = req.userInfo.id;

      const showUserInstance: ShowUserDTO = await this.userService.show(userId);

      return res.status(200).json(showUserInstance);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Deactivates a user by setting `isActive` to `false`.
   *
   * @param req - Express request object containing `userInfo.id`.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   * @returns A promise that resolves to a response indicating successful deactivation or a 404 status if the user is not found.
   */
  public delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const userId = req.userInfo.id;

      await this.userService.delete(userId);

      return res
        .status(200)
        .json({ message: "Usuário desativado com sucesso." });
    } catch (error) {
      next(error);
    }
  };

  public listAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users: ShowUserDTO[] = await this.userService.findAll();
      // console.log(users);

      return res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  };
}

// Export a singleton instance of UserController with the userService injected
export default new UserController(userService);
