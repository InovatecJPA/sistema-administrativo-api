import { IMailer } from "../interfaces/IMailer";
import { EmailContext } from "../models/EmailContext";
import { EmailTemplate } from "../enums/EmailTemplate";
import { EmailFactory } from "../factories/EmailFactory";

export class EmailService {
  private mailer: IMailer;

  constructor(mailer: IMailer) {
    this.mailer = mailer;
  }

  async sendEmail(to: string, template: EmailTemplate): Promise<string> {
    const context = EmailFactory.createEmailConfig(template, to);
    const subject = this.getSubject(template);
    const message = this.getMessage(template);

    return this.mailer.sendMail(
      to,
      subject,
      message,
      template,
      context.getContext()
    );
  }

  private getSubject(template: EmailTemplate): string {
    switch (template) {
      case EmailTemplate.ResetPassword:
        return "Redefinir senha";
      case EmailTemplate.ActivateAccount:
        return "Ativação de conta";
      default:
        return "Notificação";
    }
  }

  private getMessage(template: EmailTemplate): string {
    switch (template) {
      case EmailTemplate.ResetPassword:
        return "Clique no link abaixo para redefinir sua senha.";
      case EmailTemplate.ActivateAccount:
        return "Clique no link abaixo para ativar sua conta.";
      default:
        return "Mensagem não definida.";
    }
  }
}
