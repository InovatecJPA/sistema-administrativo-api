import User from "../model/User";
import * as jwt from "../../../config/jwt";
import { Repository } from "typeorm";
import { Request, Response, NextFunction } from "express";
import { UnauthorizedException } from "../../../error/UnauthorizedException";
import { NotFoundError } from "../../../error/NotFoundError";

export default class TokenController {
  private userRepository: Repository<User>;

  constructor(userRepository: Repository<User>) {
    this.userRepository = userRepository;
  }

  public store = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { email = "", password = "" } = req.body;

      if (!email || !password) {
        throw new UnauthorizedException("Credenciais inválidas.");
      }

      const user: User = await this.userRepository.findOneBy({ email });

      if (!user) {
        throw new NotFoundError("Usuário não registrado.");
      }

      if (!(await user.comparePassword(password))) {
        throw new UnauthorizedException("Senha do usuário inválida.");
      }

      const { id, profile, name } = user;

      const profileId: string = profile.id;
      const token: string = jwt.signToken({ id, name, email, profileId });

      return res.json({ token, user: { nome: user.name, email } });
    } catch (error) {
      next(error);
    }
  }
}
