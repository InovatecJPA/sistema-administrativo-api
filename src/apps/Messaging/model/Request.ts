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

@Entity("requests")
export default class Request {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", nullable: false })
    name: string;

    @ManyToMany(() => User, (user) => user.chats)
    @JoinTable({
        name: "request_users",
        joinColumn: { name: "request_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "user_id", referencedColumnName: "id" },
    })
    users: User[];
    
    @OneToMany(() => Message, (message) => message.chat, { eager: true })
    messages: Message[];

    @OneToMany(() => Attachment, (attachment) => attachment.request, { eager: true })
    attachments: Attachment[];
}
