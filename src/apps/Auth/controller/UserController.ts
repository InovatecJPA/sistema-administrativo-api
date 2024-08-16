import Profile from "../model/Profile";
import User from "../model/User";

import { Request, Response } from "express";
import AppDataSource from "../../../database/dbConnection";
import jwt from "jsonwebtoken";

import CpfValidator from "../utils/cpfValidator";
import moment from "moment";

// const sendMailPromise = require('../../Emails/mailer/mailer');
// const helper = require('../../Emails/controllers/candidatoHelper');
//

class UserController {
  async store(req: Request, res: Response): Promise<Response> {
    try {
      const { password, cpf, name, email, phone } = req.body;

      let errors: String[] = [];

      // emailValidation
      if (!email) {
        errors.push("Coloque um email");
      }

      // Validação CPF

      // Validação de telefone
      if (!phone) {
        errors.push("Coloque um telefone");
      }

      // Verificação de erros
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const profileRepository = AppDataSource.getRepository(Profile);
      const userRepository = AppDataSource.getRepository(User);

      // Criação do perfil, se necessário
      let profile = await profileRepository.findOne({
        where: { name: "User_comun" },
      });

      if (!profile) {
        profile = profileRepository.create({
          name: "User_comun",
          description: "usuario comun",
          isAdmin: false,
        });
        await profileRepository.save(profile);
      }

      try {
        // Criação do usuário
        const newUser = userRepository.create({
          profile,
          password,
          cpf,
          name,
          email,
          phone,
          isAtivo: true,
        });

        await userRepository.save(newUser);

        const token = jwt.sign(
          {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            profile_id: newUser.profile.id,
          },
          process.env.TOKEN_SECRET as string,
          {
            expiresIn: process.env.TOKEN_EXPIRATION,
          }
        );

        return res.json({
          token,
          user: { name: newUser.name, email: newUser.email },
        });
      } catch (err: any) {
        if (err.name === "QueryFailedError" && err.code === "23505") {
          const errorMessages = (err.detail || "Erro de unicidade").split("\n");
          return res.status(400).json({ errors: errorMessages });
        }
        console.error(err);
        return res.status(500).json({ error: "Erro interno do servidor" });
      }
    } catch (err: any) {
      console.error(err.message);
      return res.status(500).json({ error: err.message });
    }
  }
}

export default new UserController();
