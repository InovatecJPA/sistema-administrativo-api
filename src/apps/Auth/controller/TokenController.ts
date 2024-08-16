import jwt from "jsonwebtoken";
import User from "../model/User";
import { Repository } from "typeorm";
import { Request, Response } from "express";
import AppDataSource from "../../../database/dbConnection";

export default class TokenController {
  private static userRepository: Repository<User> =
    AppDataSource.getRepository(User);

  static async store(req: Request, res: Response): Promise<Response> {
    const { email = "", password = "" } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        errors: ["Email ou senha invalida ."],
      });
    }

    const user: User = await this.userRepository.findOneBy({ email: email });

    if (!user) {
      return res.status(401).json({
        errors: ["Usuário não registrado."],
      });
    }

    if (!(await user.validPassword(password))) {
      return res.status(401).json({
        errors: ["Senha do usuário inválida."],
      });
    }

    const { id, profile_id, name } = user;

    const token: string = jwt.sign(
      { id, name, email, profile_id },
      process.env.TOKEN_SECRET,
      {
        expiresIn: process.env.TOKEN_EXPIRATION,
      }
    );

    return res.json({ token, user: { nome: user.name, email } });
  }
}
