import AppDataSource from "../../../database/dbConnection";
import Token from "../model/Token";
import User from "../model/User";
import { UserService, userService } from "./UserService";

import * as jwt from "../../../config/jwt";
import { Repository } from "typeorm";
import { NotFoundError } from "../../../error/NotFoundError";
import { UnauthorizedException } from "../../../error/UnauthorizedException";

export class TokenService {
  private readonly userservice: UserService;
  private readonly tokenRepository: Repository<Token>;

  constructor(userservice: UserService, tokenRepository: Repository<Token>) {
    this.userservice = userservice;
    this.tokenRepository = tokenRepository;
  }

  public async generateResetToken(_userId: string): Promise<string> {
    const resetToken = jwt.signToken({ userId: _userId }, "5m");

    let token = await this.tokenRepository.findOne({
      where: { userId: _userId },
    });

    if (token) {
      token.token = resetToken;
      token.isUsed = false;
    } else {
      token = this.tokenRepository.create({
        userId: _userId,
        token: resetToken,
      });
    }

    await this.tokenRepository.save(token);

    console.log(resetToken);

    return resetToken;
  }

  public invalidateToken(token: string): void {
    //Marcar o token como usado para evitar reutilização
    this.tokenRepository.update({ token }, { isUsed: true });
  }

  public async validateResetToken(token: string): Promise<User> {
    try {
      // Decodifica e verifica o token com o segredo JWT
      const payload = jwt.verifyToken(token) as { userId: string };

      // Busca o usuário pelo ID decodificado do token
      const user = await this.userservice.getUserById(payload.userId);

      if (!user) {
        throw new NotFoundError("Usuário não encontrado.");
      }

      // Busca o token no banco de dados associado ao usuário
      const tokenEntity = await this.tokenRepository.findOne({
        where: { userId: user.id },
      });

      // Verifica se o token existe, corresponde ao token passado, e não foi usado
      if (!tokenEntity || tokenEntity.token !== token || tokenEntity.isUsed) {
        throw new UnauthorizedException("Token inválido ou expirado.");
      }

      tokenEntity.isUsed = true;
      await this.tokenRepository.save(tokenEntity);

      // Retorna o usuário se todas as verificações passarem
      return user;
    } catch (error) {
      // Lança uma exceção de autorização caso o token seja inválido ou expirado
      throw new UnauthorizedException("Token inválido ou expirado.");
    }
  }
}

const tokenRepository = AppDataSource.getRepository(Token);

export const tokenService = new TokenService(userService, tokenRepository);
