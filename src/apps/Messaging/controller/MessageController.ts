import { messageService, MessageService } from "../service/MessageService";

export class MessageController {
    private messageService: MessageService;

    constructor(messageService: MessageService) {
        this.messageService = messageService;
    }
}

export default new MessageController(messageService);