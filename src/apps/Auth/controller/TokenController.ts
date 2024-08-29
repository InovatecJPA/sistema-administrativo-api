import jwt from "jsonwebtoken";
import User from "../model/User";
import { Repository } from "typeorm";
import { Request, Response, NextFunction } from "express";
import CustomValidationError from "../error/CustomValidationError";

export default class TokenController {
  private userRepository: Repository<User>;

  constructor(userRepository: Repository<User>) {
    this.userRepository = userRepository;
  }

  async store(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { email = "", password = "" } = req.body;

      if (!email || !password) {
        throw new CustomValidationError("Email ou senha não está sendo enviado.", 401);
      }

      const user: User = await this.userRepository.findOneBy({ email });

      if (!user) {
        throw new CustomValidationError("Usuário não registrado.", 401);
      }

      if (!(await user.comparePassword(password))) {
        throw new CustomValidationError("Senha do usuário inválida.", 401);
      }

      const { id, profile, name } = user;

      const profileId: string = profile.id;
      const token: string = jwt.sign(
        { id, name, email, profileId },
        process.env.TOKEN_SECRET,
        {
          expiresIn: process.env.TOKEN_EXPIRATION,
        }
      );

      return res.json({ token, user: { nome: user.name, email } });
    } catch (error) {
      next(error);
    }
  }
}
