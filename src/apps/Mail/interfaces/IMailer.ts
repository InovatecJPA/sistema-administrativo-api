import { MailContext } from "../models/EmailContext";

export interface IMailer {
  sendMail(
    to: string,
    subject: string,
    message: string,
    template: string,
    context: MailContext
  ): Promise<string>;
}
