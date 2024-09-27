import { EmailService } from "../services/EmailService";
import { EmailTemplate } from "../enums/EmailTemplate";
import { IMailer } from "../interfaces/IMailer";

// Mock de IMailer para testes
class MailerMock implements IMailer {
  async sendMail(
    to: string,
    subject: string,
    message: string,
    template: string,
    context: any
  ): Promise<string> {
    return `Email enviado para ${to} com o template ${template}`;
  }
}

describe("EmailService", () => {
  let emailService: EmailService;

  beforeEach(() => {
    const mailerMock = new MailerMock();
    emailService = new EmailService(mailerMock);
  });

  it("deve enviar um email com o template de ResetPassword", async () => {
    const response = await emailService.sendEmail(
      "test@example.com",
      EmailTemplate.ResetPassword
    );

    expect(response).toBe(
      "Email enviado para test@example.com com o template resetPassword"
    );
  });

  it("deve retornar o assunto correto para o template de ResetPassword", async () => {
    const subject = emailService["getSubject"](EmailTemplate.ResetPassword);
    expect(subject).toBe("Redefinir senha");
  });
});
