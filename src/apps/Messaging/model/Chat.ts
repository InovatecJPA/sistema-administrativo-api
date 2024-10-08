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

@Entity("chats")
export default class Chat {

    /**
     * The unique identifier for the chat.
     *
     * @type {string}
     * @memberof Chat
     */
    @PrimaryGeneratedColumn("uuid")
    id: string;

    /**
     * The name of the chat.
     *
     * @type {string}
     * @memberof Chat
     */

    @Column({ type: "varchar", nullable: false })
    name: string;

    /**
     * The users that are part of the chat.
     * Many users can participate in many chats.
     *
     * @type {User[]}
     * @memberof Chat
     */
    @ManyToMany(() => User, (user) => user.chats)
    @JoinTable({
        name: "chat_users",
        joinColumn: { name: "chat_id", referencedColumnName: "id" },
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
    @OneToMany(() => Message, (message) => message.chat)
    messages: Message[];
}
