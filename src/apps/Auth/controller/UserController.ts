import { NextFunction, Request, Response } from "express";
import * as jwt from "./../../../config/jwt";
import moment from "moment";

import User from "../model/User";
import Profile from "../model/Profile";
import { Repository } from "typeorm";
import AppDataSource from "../../../database/dbConnection";
import CpfValidator from "../utils/CpfValidator";

import { sendMailPromise } from "../../mail/mailer";
import helper from "../../mail/helper/mailHelper";
import { UserService, userService } from "../service/UserService";
import * as UserDTO from "../dto/user.dto";
import { NotFoundError } from "../../../error/NotFoundError";
import { updateUserSchema, UpdateUserDTO } from "../schemas/userSchemas";

class UserController {
  private readonly userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  public listPaginated = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;

      // Chama o serviço para obter os usuários paginados
      const result = await this.userService.getUsersPaginated(page);
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

  public update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const updateData: UpdateUserDTO = updateUserSchema.parse(req.body);

      this.userService.updateUser(req.userInfo.id, updateData);

      res.status(200).json({ message: "Usuário atualizado com sucesso." });
    } catch (error) {
      next(error);
    }
  };

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

  public show = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Object> => {
    try {
      const userId = req.userInfo.id;

      const showUserInstance = await this.userService.show(userId);

      return showUserInstance;
    } catch (error) {
      next(error);
    }
  };

  // Não atualizado

  public delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const userRepository: Repository<User> =
        AppDataSource.getRepository(User);

      const user: User | null = await userRepository.findOne({
        where: { id: req.userInfo.id },
      });

      if (!user) {
        return res.status(404).json({
          errors: ["Usuário não encontrado."],
        });
      }

      await userRepository.update(user.id, { isActive: false });

      return res.json({
        message: "Usuário desativado com sucesso.",
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new UserController(userService);
