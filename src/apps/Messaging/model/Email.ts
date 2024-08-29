import mailConfig from "../../../config/mailConfig";
import { EmailTemplate } from "./EmailTemplate";

export default class Email {
    public emailAddress: string;
    public subject: string;
    public message: string;
    public template: EmailTemplate;
    public link: string;
    public imageUrl: string;
    public user?: string;
    public userName?: string;
    public password?: string;

    constructor(
        emailAddress: string,
        subject: string,
        message: string,
        template: EmailTemplate = EmailTemplate.ActivateAccount,
        link: string = mailConfig.baseUrl,
        imageUrl: string = mailConfig.baseUrl,
        user?: string,
        userName?: string,
        password?: string
    ) {
        this.emailAddress = emailAddress;
        this.subject = subject;
        this.message = message;
        this.template = template;
        this.link = link;
        this.imageUrl = imageUrl;
        this.user = user;
        this.userName = userName;
        this.password = password;
    }
}
