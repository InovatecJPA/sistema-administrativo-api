import { EmailTemplate } from "../enums/EmailTemplate";
import { EmailContext } from "../models/EmailContext";

export class EmailFactory {
  static createEmailConfig(template: EmailTemplate, to: string): EmailContext {
    const context = new EmailContext();
    switch (template) {
      case EmailTemplate.ResetPassword:
        context.setVariable("link", "https://example.com/reset-password");
        break;
      case EmailTemplate.ActivateAccount:
        context.setVariable("link", "https://example.com/activate-account");
        break;
      // Adicione outros casos conforme necessário
      default:
        throw new Error("Template não suportado");
    }
    return context;
  }
}
