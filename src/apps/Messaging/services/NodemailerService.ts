// services/NodemailerService.ts
import nodemailer, { Transporter } from "nodemailer";
import hbs, {
  NodemailerExpressHandlebarsOptions,
} from "nodemailer-express-handlebars";
import { IMailer } from "../interfaces/IMailer";
import mailConfig from "../../../config/mailConfig";
import { MailContext } from "../models/EmailContext";

export class NodemailerService implements IMailer {
  private transporter: Transporter;

  constructor() {
    const options: NodemailerExpressHandlebarsOptions = {
      viewEngine: {
        layoutsDir: __dirname + "/view/layout",
        extname: ".hbs",
      },
      extName: ".hbs",
      viewPath: __dirname + "/view/",
    };

    this.transporter = nodemailer.createTransport({
      host: mailConfig.host,
      port: mailConfig.port,
      secure: mailConfig.secure,
      auth: {
        user: mailConfig.user,
        pass: mailConfig.pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    this.transporter.use("compile", hbs(options));
  }

  async sendMail(
    to: string,
    subject: string,
    message: string,
    template: string,
    context: MailContext
  ): Promise<string> {
    const mailOptions = {
      from: mailConfig.user,
      to,
      subject,
      text: message,
      template,
      context,
    };

    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          console.log(info.response);
          resolve(info.response);
        }
      });
    });
  }
}
