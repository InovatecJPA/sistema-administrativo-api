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
import * as UserDTO from "../interface/userInterfaces";

class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  public store = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userDTO: UserDTO.createUserDTO = req.body;

      const result = await this.userService.store(userDTO);

      return res.status(200).json(result);
    } catch (e: any) {
      console.log(e);
      return res.status(400).json({ errors: e.message.split("; ") });
    }
  };

  async recoveryPassword(req: Request, res: Response): Promise<Response> {
    try {
      const { email = "" } = req.body;
      let errors: String[] = [];
      let emailData = helper.createDefaultEmailConfig(email);

      if (!email) {
        errors.push("Um e-mail é obrigatório.");
      }

      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      try {
        const userRepository: Repository<User> =
          AppDataSource.getRepository(User);
        const user: User | null = await userRepository.findOneBy({
          email: email,
        });

        if (!user) {
          return res.status(404).json({
            errors: ["Email não registrado."],
          });
        }

        let domain = email.substring(email.indexOf("@"));
        let newPassword = "1234";

        emailData.variables.user = user.getFirstName();
        emailData.variables.userName = user.cpf;
        emailData.variables.password = newPassword;

        user.password = newPassword;

        await user.hashPassword();
        await userRepository.save(user, { data: user.password });

        // sendMailPromise(
        //   emailData.email,
        //   emailData.subject,
        //   emailData.message,
        //   emailData.template,
        //   emailData.variables
        // );

        return res.json({
          message: "Sucesso! Verifique seu e-mail para obter a nova senha.",
        });
      } catch (error: any) {
        console.log("Erro ao buscar usuário ou atualizar senha:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
      }
    } catch (error: any) {
      console.log("Erro ao processar a recuperação de senha:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

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

  async indexAll(req: Request, res: Response): Promise<Response> {
    try {
      const userRepository: Repository<User> =
        AppDataSource.getRepository(User);
      const page =
        req.query.page == undefined || req.query.page == null
          ? 1
          : Number(req.query.page);
      const limit = 10;
      let lastPage = 1;
      const countUser = await userRepository.count();

      if (countUser !== 0) {
        lastPage = Math.ceil(countUser / limit);

        const userObj = await userRepository
          .createQueryBuilder("user")
          .select([
            "user.email",
            "SUBSTRING(user.name, 1, POSITION(' ' IN user.name) - 1) AS firstName", // Usando SUBSTRING para PostgreSQL
          ])
          .orderBy("user.id", "ASC")
          .offset(Number(page * limit - limit))
          .limit(limit)
          .getRawMany();

        let pagination = {
          path: "/users",
          page: page,
          prev_page_url: page - 1 >= 1 ? page - 1 : false,
          next_page_url: page + 1 > lastPage ? false : page + 1,
          total: countUser,
        };

        return res.json({ listUser: userObj, pagination: pagination });
      } else {
        return res.status(404).json({ error: "Nenhum usuário encontrado." });
      }
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

  // Não vai ficar aqui...
  async login(req: Request, res: Response): Promise<Response> {
    try {
      const userLogin: UserDTO.userLogin = req.body;

      if (!userLogin || !userLogin.email || !userLogin.password) {
        return res.status(400).json({
          errors: ["E-mail e senha são obrigatórios."],
        });
      }

      const userRepository: Repository<User> =
        AppDataSource.getRepository(User);

      const user = await userRepository.findOne({
        where: {
          email: userLogin.email,
        },
        relations: ["profile"],
      });

      //console.log(user);

      if (!user || !(await user.comparePassword(userLogin.password))) {
        return res.status(404).json({
          errors: ["E-mail ou senha incorretos"],
        });
      }

      const profile = user.profile.name;

      const token = jwt.signToken({
        id: user.id,
        email: user.email,
        isAdmin: profile === "admin" ? true : false,
        profile_id: user.profile.id,
      });

      res.status(200).json({ auth: true, token: token });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}

export default new UserController(userService);
