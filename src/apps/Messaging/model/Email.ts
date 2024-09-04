import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import mailConfig from "../../config/mailConfig";
import { EmailTemplate } from "./EmailTemplate";

/**
 * Represents an email entity in the system.
 * 
 * @entity
 */
@Entity()
export default class Email {
    /**
     * Unique identifier for the email entity.
     * 
     * @type {number}
     * @primaryGeneratedColumn
     */
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * The recipient email address.
     * 
     * @type {string}
     * @column {varchar(255)}
     */
    @Column({ type: "varchar", length: 255 })
    email: string;

    /**
     * The subject of the email.
     * 
     * @type {string}
     * @column {varchar(255)}
     */
    @Column({ type: "varchar", length: 255 })
    subject: string;

    /**
     * The body content of the email.
     * 
     * @type {string}
     * @column {text}
     */
    @Column({ type: "text" })
    message: string;

    /**
     * The email template used for the email.
     * 
     * @type {EmailTemplate}
     * @column {varchar(255)} 
     * @default EmailTemplate.ActivateAccount
     */
    @Column({ type: "varchar", length: 255, default: EmailTemplate.ActivateAccount })
    template: string;

    /**
     * The URL link included in the email.
     * 
     * @type {string}
     * @column {varchar(255)}
     * @default mailConfig.baseUrl
     */
    @Column({ type: "varchar", length: 255, default: mailConfig.baseUrl })
    link: string;

    /**
     * The URL for the email image.
     * 
     * @type {string}
     * @column {varchar(255)}
     * @default mailConfig.baseUrl
     */
    @Column({ type: "varchar", length: 255, default: mailConfig.baseUrl })
    imageUrl: string;

    /**
     * Optional user identifier associated with the email.
     * 
     * @type {string}
     * @column {varchar(255)} 
     * @nullable
     */
    @Column({ type: "varchar", length: 255, nullable: true })
    user?: string;

    /**
     * Optional username associated with the email.
     * 
     * @type {string}
     * @column {varchar(255)} 
     * @nullable
     */
    @Column({ type: "varchar", length: 255, nullable: true })
    userName?: string;

    /**
     * Optional password associated with the email.
     * 
     * @type {string}
     * @column {varchar(255)} 
     * @nullable
     */
    @Column({ type: "varchar", length: 255, nullable: true })
    password?: string;
    
    /**
     * Creates an instance of the Email class.
     * 
     * @param email - The recipient email address. This field is required and should be a valid email address.
     * @param subject - The subject of the email. This field is required and should be a descriptive subject line.
     * @param message - The body content of the email. This field is required and should contain the main content of the email.
     * @param template - The email template used for formatting the email (default is `EmailTemplate.ActivateAccount`). This field determines the style and content structure of the email.
     * @param link - The URL link included in the email (default is `mailConfig.baseUrl`). This URL is often used for links or actions in the email.
     * @param imageUrl - The URL for an image to include in the email (default is `mailConfig.baseUrl`). This image can be used for branding or content within the email.
     * @param user - An optional user identifier associated with the email. This can be used for personalizing the email or tracking purposes.
     * @param userName - An optional username associated with the email. This can be used for personalizing the email content.
     * @param password - An optional password associated with the email. This may be included for secure access or login details.
     */
    constructor(
        email: string,
        subject: string,
        message: string,
        template: EmailTemplate = EmailTemplate.ActivateAccount,
        link: string = mailConfig.baseUrl,
        imageUrl: string = mailConfig.baseUrl,
        user?: string,
        userName?: string,
        password?: string
    ) {
        this.email = email;
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
