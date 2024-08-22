import nodemailer, { Transporter } from "nodemailer";
import hbs from "nodemailer-express-handlebars";

import mailConfig from "../../config/mailConfig";

const options = {
  viewEngine: {
    partialsDir: __dirname + "/views/partials",
    layoutsDir: __dirname + "/views/layouts",
    extname: ".hbs",
  },
  extName: ".hbs",
  viewPath: __dirname + "/views/",
};

const transporter = nodemailer.createTransport({
  host: mailConfig.host,
  port: mailConfig.port,
  secure: mailConfig.secure,
  auth: {
    user: mailConfig.user,
    pass: mailConfig.pass,
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
});

transporter.use("compile", hbs(options));

interface MailContext {
  [key: string]: any;
}

interface SendMailCallback {
  (error: Error | null, response: string | null): void;
}

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

  transporter.sendMail(mailOptions, function (error, info) {
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
  context: MailContext,
  cb?: SendMailCallback
) => {
  return new Promise((resolve, reject) => {
    console.log(mailConfig.user);
    const mailOptions = {
      from: mailConfig.user,
      to: to,
      subject: subject,
      text: message,
      template: template,
      context: context,
    };

    resolve(transporter.sendMail(mailOptions));
  });
};

export { sendMail, sendMailPromise };
