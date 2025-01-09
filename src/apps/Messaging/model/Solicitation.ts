import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import User from "../../Auth/model/User";
import Message from "./Message";
import Attachment from "./Attachment";

@Entity("solicitations")
export default class Solicitation {

    /**
     * The unique identifier for the chat.
     *
     * @type {string}
     * @memberof Solicitation
     */
    @PrimaryGeneratedColumn("uuid")
    id: string;

    /**
     * The name of the chat.
     *
     * @type {string}
     * @memberof Solicitation
     */

    @Column({ type: "varchar", nullable: false })
    solicitationName: string;

    /**
     * The users that are part of the chat.
     * Many users can participate in many chats.
     *
     * @type {User[]}
     * @memberof Solicitation
     */
    @ManyToMany(() => User, (user) => user.solicitations, { eager: true })
    @JoinTable({
        name: "solititation_users",
        joinColumn: { name: "solicitation_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "user_id", referencedColumnName: "id" },
    })
    users: User[];

    /**
     * The messages that are part of the chat.
     * One chat can have many messages.
     *
     * @type {Message[]}
     * @memberof Chat
     */
    @OneToMany(() => Message, (message) => message.solicitation, { eager: true })
    messages: Message[];


    @OneToMany(() => Attachment, (attachment) => attachment.solicitation, { eager: true })
    attachments: Attachment[];

}
