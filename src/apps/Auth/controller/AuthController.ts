import { changePasswordSchema } from "../schemas/userSchemas";
import { AuthService, authService } from "../service/AuthService";
import { NextFunction, Request, Response } from "express";

export class AuthController {
  private readonly authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  // Método para realizar o login
  public login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = await this.authService.login(req.body);
      res.status(200).json(token);
    } catch (error) {
      next(error);
    }
  };

  // Método para criar um novo usuário
  public singUp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // req.body.cpf = req.body.cpf.replace(/\D/g, "");
      const token = await this.authService.singUp(req.body);
      res.status(201).json(token);
    } catch (error) {
      next(error);
    }
  };

  // forgotPassword - Método para solicitar um token de redefinição de senha
  public requestResetToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email } = req.body;

      await this.authService.requestResetToken(email);
      res.status(200).json({ messagem: "Link enviado para o e-mail." });
    } catch (error) {
      next(error);
    }
  };

  // resetPassword - Método para redefinir a senha
  public resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      const loginToken = await this.authService.resetPassword(token, password);

      res.status(200).json(loginToken);
    } catch (error) {
      next(error);
    }
  };

  // changePassword - Método para alterar a senha
  public changePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userInfo = req.userInfo;
      const cgPssData = changePasswordSchema.parse(req.body);

      await this.authService.changePassword(userInfo, cgPssData);

      res.status(200).json("Senha alterada com sucesso.");
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController(authService);

// return res.json({
//   user: {
//     name: user.getFirstName(),
//     last_name: user.getLastName(),
//     email: user.email,
//     cpf: user.cpf,
//     phone: user.phone,
//     birthDate: user.birthDate
//       ? moment(user.birthDate).format("DD/MM/YYYY")
//       : null,
//   },
// });
