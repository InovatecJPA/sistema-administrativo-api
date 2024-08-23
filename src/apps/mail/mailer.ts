import nodemailer, { Transporter } from "nodemailer";
import hbs, {
  NodemailerExpressHandlebarsOptions,
} from "nodemailer-express-handlebars";
import mailConfig from "../../config/mailConfig";

interface MailContext {
  [key: string]: any; // Defina o tipo das variáveis de contexto conforme necessário
}

interface SendMailCallback {
  (error: Error | null, info: string | null): void;
}

const options: NodemailerExpressHandlebarsOptions = {
  viewEngine: {
    // partialsDir: __dirname + "/views/partials",
    layoutsDir: __dirname + "/view/layout",
    extname: ".hbs",
  },
  extName: ".hbs",
  viewPath: __dirname + "/view/",
};

const transporter: Transporter = nodemailer.createTransport({
  host: mailConfig.host,
  port: mailConfig.port,
  secure: mailConfig.secure,
  auth: {
    user: mailConfig.user,
    pass: mailConfig.pass,
  },
  tls: {
    rejectUnauthorized: false, // do not fail on invalid certs
  },
});

transporter.use("compile", hbs(options));

const sendMail = async (
  to: string,
  subject: string,
  message: string,
  template: string,
  context: MailContext,
  cb: SendMailCallback
): Promise<void> => {
  const mailOptions = {
    from: mailConfig.user,
    to: to,
    subject: subject,
    text: message,
    template: template,
    context: context,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      cb(error, null);
    } else {
      console.log(info.response);
      cb(null, info.response);
    }
  });
};

const sendMailPromise = (
  to: string,
  subject: string,
  message: string,
  template: string,
  context: MailContext
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: mailConfig.user,
      to: to,
      subject: subject,
      text: message,
      template: template,
      context: context,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        console.log(info.response);
        resolve(info.response);
      }
    });
  });
};

export { sendMail, sendMailPromise };
