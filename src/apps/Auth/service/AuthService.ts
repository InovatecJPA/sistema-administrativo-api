import { userService } from "./UserService";
import * as UserDTO from "../dto/user.dto";
import { UserService } from "./UserService";
import { UnauthorizedException } from "../../../error/UnauthorizedException";
import * as jwt from "../../../config/jwt";
// import helper from "../../mail/helper/mailHelper";
import User from "../model/User";
import { NotFoundError } from "../../../error/NotFoundError";
import { randomBytes } from "crypto";
import { tokenService } from "./TokenService";
import {
  createUserDTO,
  userLoginDTO,
  changePasswordDTO,
} from "../schemas/userSchemas";

// import { sendMailPromise } from "../../mail/mailer";

export class AuthService {
  private readonly userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  public login = async (logindto: userLoginDTO): Promise<{ token: string }> => {
    const user = await this.userService.findOne({email: logindto.email});

    if (!user || !(await user.comparePassword(logindto.password))) {
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
    userDTO: createUserDTO
  ): Promise<{ token: string }> => {
    //userDTO.cpf = userDTO.cpf.replace(/\D/g, "");
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
    // let emailData = helper.createDefaultEmailConfig(email);

    let user: User | null = await this.userService.findOne({email: email});

    if (!user) {
      throw new NotFoundError("Usuário não registrado.");
    }

    // coisas relacionadas ao token
    const token = await tokenService.generateResetToken(user.id);

    const link = `${process.env.APP_URL}/passwordReset/${token}`;

    console.log(`Link de recuperação de senha: ${link}`);

    // emailData.subject = "Recuperação de senha";
    // emailData.variables.user = user.getFirstName();
    // emailData.variables.link = link;
    // emailData.variables.userName = user.getFirstName();

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
  ): Promise<{ token: string }> => {
    let user = await tokenService.validateResetToken(token);

    user.password = newPassword;
    user = await this.userService.updateUser(user);

    const userInformation: UserDTO.userInfo = {
      id: user.id,
      email: user.email,
      isAdmin: user.profile.name === "admin" ? true : false,
      profile_id: user.profile.id,
    };

    const loginToken = jwt.signToken(userInformation);

    return { token: loginToken };
  };

  public changePassword = async (
    userInfo: UserDTO.userInfo,
    changePasswordDTO: changePasswordDTO
  ): Promise<boolean> => {
    let user = await this.userService.findOne({id: userInfo.id});

    if (
      changePasswordDTO.newPassword !== changePasswordDTO.newPasswordConfirm ||
      !(await user.comparePassword(changePasswordDTO.oldPassword))
    ) {
      throw new UnauthorizedException("As senhas não coincidem.");
    }

    user.password = changePasswordDTO.newPassword;
    user = await this.userService.updateUser(user);

    // enviar email dizendo que a senha foi alterada!!!

    return true;
  };
}

export const authService = new AuthService(userService);
