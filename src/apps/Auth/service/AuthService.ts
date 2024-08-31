import { userService } from "./UserService";
import * as UserDTO from "../dto/user.dto";
import { UserService } from "./UserService";
import { UnauthorizedException } from "../../../error/UnauthorizedException";
import * as jwt from "../../../config/jwt";
import helper from "../../mail/helper/mailHelper";
import User from "../model/User";
import { NotFoundError } from "../../../error/NotFoundError";
import { randomBytes } from "crypto";
import { tokenService } from "./TokenService";

import { sendMailPromise } from "../../mail/mailer";

export class AuthService {
  private readonly userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  private randomGuesPassword = (length: number): string => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}[]";
    const charactersLength = characters.length;

    // Usando 'crypto' para gerar bytes aleatórios
    const randomBytesArray = randomBytes(length);

    let result = "";
    for (let i = 0; i < length; i++) {
      // Usar cada byte aleatório para escolher um caractere
      const randomIndex = randomBytesArray[i] % charactersLength;
      result += characters[randomIndex];
    }

    return result;
  };

  public login = async (
    logindto: UserDTO.userLogin
  ): Promise<{ token: string }> => {
    const user = await this.userService.getUserByEmail(logindto.email);

    if (!user || !(await user.comparePassword(logindto.password))) {
      console.log("LOGIN ERROR - E-mail ou senha incorretos");
      throw new UnauthorizedException("E-mail ou senha incorretos");
    }

    const userInformation: UserDTO.userInfo = {
      id: user.id,
      email: user.email,
      isAdmin: user.profile.name === "admin" ? true : false,
      profile_id: user.profile.id,
    };

    const token = jwt.signToken(userInformation);

    return { token: token };
  };

  public singUp = async (
    userDTO: UserDTO.createUser
  ): Promise<{ token: string }> => {
    const newUser = await this.userService.createUser(userDTO);

    const userInformation: UserDTO.userInfo = {
      id: newUser.id,
      email: newUser.email,
      isAdmin: newUser.profile.name === "admin" ? true : false,
      profile_id: newUser.profile.id,
    };

    const token = jwt.signToken(userInformation);

    return { token: token };
  };

  public requestResetToken = async (email: string): Promise<string> => {
    // Vai ser ajustado por arthur
    let emailData = helper.createDefaultEmailConfig(email);

    let user: User | null = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new NotFoundError("Usuário não registrado.");
    }

    // coisas relacionadas ao token
    const token = await tokenService.generateResetToken(user.id);

    const link = `${process.env.APP_URL}/passwordReset/${token}`;

    console.log(`Link de recuperação de senha: ${link}`);

    emailData.subject = "Recuperação de senha";
    emailData.variables.user = user.getFirstName();
    emailData.variables.link = link;
    emailData.variables.userName = user.getFirstName();

    // await sendMailPromise(
    //   emailData.email,
    //   emailData.subject,
    //   emailData.message,
    //   emailData.template,
    //   emailData.variables
    // );

    console.log(`E-mail de recuperação de senha enviado para ${email}`);

    // Retorna uma mensagem de sucesso ou null conforme necessário
    return "E-mail de recuperação de senha enviado com sucesso.";
  };

  // retorna token pra login
  public resetPassword = async (
    token: string,
    newPassword: string
  ): Promise<string> => {
    const user = await tokenService.validateResetToken(token);

    user.password = newPassword;
    await this.userService.updateUser(user);

    return "Senha redefinida com sucesso.";
  };
}

export const authService = new AuthService(userService);
