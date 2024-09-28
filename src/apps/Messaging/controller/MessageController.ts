import { messageService, MessageService } from "../service/MessageService";
import { NotFoundError } from "../../../error/NotFoundError";

import { NextFunction, Request, Response } from "express";
import Message from "../model/Message";
import MessageDto from "../dto/MessageDto";
import { InvalidObjectError } from "../../../error/InvalidObjectError";

export class MessageController {

    private messageService: MessageService;

    constructor(messageService: MessageService) {
        this.messageService = messageService;
    }

    public post = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
      try{
        const { text, sender, receiver, receiverGroup } = req.body
        const messageDto: MessageDto = new MessageDto(text, sender, receiver, receiverGroup);

        if(!messageDto.isValid()) {
          throw new InvalidObjectError('All fields of the new message must be non-null or different of "" .');
        }

        const newMessage: Message = messageDto.toMessage();

        return res.status(201).json(newMessage);

      } catch (error: any) {
        next(error);
      }
    }

    public getByDate = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { sendedAtDay } = req.params;
            const messages = await this.messageService.findAllByDate(sendedAtDay);
            
        if (!messages) {
            throw new NotFoundError('No message founded at this date.');
        }
    
        return res.status(200).json(messages);

        } catch (error: any) {
            next(error);
        }
    }
    
    public getAll = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
          const messages = await this.messageService.findAll();

          return res.json(messages);

        } catch (error) {
          next(error);
        }
      }

    public getById = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
            const message = await this.messageService.findOneById(req.params.id);

            if (!message) {
                throw new NotFoundError(`Message with ID ${req.params.id} not found.`);
            }

            return res.status(200).json(message);

        } catch (error) {
            next(error);
        }
    }

    public put = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
          const message = await this.messageService.findOneById(req.params.id);
    
          if (!message) {
            throw new NotFoundError(`Message with ID ${req.params.id} not found.`);
          }
    
          const updatedProfile = await this.messageService.update(
            req.params.id,
            req.body
          );
    
          return res.json(updatedProfile);
        } catch (error) {
          next(error);
        }
      }

      public deleteById = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
          const result = await this.messageService.delete(req.params.id);
    
          if (result.affected === 0) {
            throw new NotFoundError(`Message with ID ${req.params.id} not found.`);
          }
    
          return res.json({ message: "Message deleted successfully" });
        } catch (error) {
          next(error);
        }
      }

}

export default new MessageController(messageService);