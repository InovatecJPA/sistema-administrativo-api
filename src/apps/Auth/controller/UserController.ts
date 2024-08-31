import { Request, Response } from "express";
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

class UserController {
  private readonly userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  public listPaginated = async (
    req: Request,
    res: Response
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
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  };

  async changePassword(req: Request, res: Response): Promise<Response> {
    const { password, newPassword, newPasswordConfirm } = req.body;
    try {
      console.log(req.userInfo);
      const userRepository: Repository<User> =
        AppDataSource.getRepository(User);

      const user: User = await userRepository.findOne({
        where: { id: req.userInfo.id },
      });

      if (!user) {
        return res.status(404).json({
          errors: ["Usuário não encontrado."],
        });
      }

      if (!(await user.comparePassword(password))) {
        return res.status(401).json({
          errors: ["Senha atual incorreta."],
        });
      }

      if (newPassword !== newPasswordConfirm) {
        return res.status(401).json({
          errors: ["As senhas não coincidem."],
        });
      }

      user.password = newPassword;
      await userRepository.save(user);

      return res.status(200).json({
        message: "Senha alterada com sucesso.",
      });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async show(req: Request, res: Response): Promise<Response> {
    try {
      const userRepository: Repository<User> =
        AppDataSource.getRepository(User);

      const user: User | undefined = await userRepository.findOne({
        where: { id: req.userInfo.id },
      });

      console.log(user);

      if (!user) {
        return res.status(404).json({
          errors: ["Usuário não encontrado."],
        });
      }

      return res.json({
        user: {
          name: user.getFirstName(),
          last_name: user.getLastName(),
          email: user.email,
          cpf: user.cpf,
          phone: user.phone,
          birthDate: user.birthDate
            ? moment(user.birthDate).format("DD/MM/YYYY")
            : null,
        },
      });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const userRepository: Repository<User> =
        AppDataSource.getRepository(User);

      const { name, email, cpf, phone, birthDate } = req.body;

      const user = await userRepository.findOne({
        where: { id: req.userInfo.id },
      });

      if (!user) {
        return res.status(404).json({
          errors: ["Usuário não encontrado."],
        });
      }

      const updatedUser = userRepository.merge(user, {
        name,
        email,
        cpf,
        phone,
        birthDate,
      });

      await userRepository.save(updatedUser);

      return res.json({
        message: "Usuário atualizado com sucesso.",
      });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
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
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}

export default new UserController(userService);
