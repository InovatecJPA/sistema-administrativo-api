import { messageService, MessageService } from "../service/MessageService";
import { NotFoundError } from "../../../error/NotFoundError";
import { NextFunction, Request, Response } from "express";
import Message from "../model/Message";
import MessageDto from "../dto/MessageDto";
import { InvalidObjectError } from "../../../error/InvalidObjectError";

export class MessageController {

    // Constructor initializes the MessageController with a MessageService instance
    private messageService: MessageService;

    constructor(messageService: MessageService) {
        this.messageService = messageService;
    }

    /**
     * POST /messages
     * Creates a new message.
     * 
     * @param req - The HTTP request object, containing message data in the body.
     * @param res - The HTTP response object.
     * @param next - Function to pass errors to the middleware.
     * @returns A response with the created message or an error.
     */
    public post = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
      try {
        const { text, sender, receiver, receiverGroup } = req.body;
        const messageDto: MessageDto = new MessageDto(text, sender, receiver, receiverGroup);

        // Check if the message data is valid
        if (!messageDto.isValid()) {
          throw new InvalidObjectError('All fields of the new message must be non-null or different of "".');
        }

        // Convert DTO to Message model and return the created message
        const newMessage = await this.messageService.save(messageDto);
        return res.status(201).json(newMessage);

      } catch (error: any) {
        next(error);
      }
    }

    /**
     * GET /messages/:sendedAtDay
     * Retrieves all messages sent on a specific date.
     * 
     * @param req - The HTTP request object, containing the date in the params.
     * @param res - The HTTP response object.
     * @param next - Function to pass errors to the middleware.
     * @returns A response with the list of messages or an error.
     */
    public getByDate = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { sendedAtDay } = req.params;
            const messages = await this.messageService.findAllByDate(sendedAtDay);
            
            // If no messages found, throw a NotFoundError
            if (!messages) {
                throw new NotFoundError('No message found on this date.');
            }
    
            return res.status(200).json(messages);

        } catch (error: any) {
            next(error);
        }
    }
    
    /**
     * GET /messages
     * Retrieves all messages from the system.
     * 
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     * @param next - Function to pass errors to the middleware.
     * @returns A response with the list of all messages.
     */
    public getAll = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
          const messages = await this.messageService.findAll();
          return res.json(messages);

        } catch (error) {
          next(error);
        }
      }

    /**
     * GET /messages/:id
     * Retrieves a specific message by its unique ID.
     * 
     * @param req - The HTTP request object, containing the ID in the params.
     * @param res - The HTTP response object.
     * @param next - Function to pass errors to the middleware.
     * @returns A response with the requested message or an error.
     */
    public getById = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
            const message = await this.messageService.findOneById(req.params.id);

            // If no message found, throw a NotFoundError
            if (!message) {
                throw new NotFoundError(`Message with ID ${req.params.id} not found.`);
            }

            return res.status(200).json(message);

        } catch (error) {
            next(error);
        }
    }

    /**
     * PUT /messages/:id
     * Updates an existing message by its ID.
     * 
     * @param req - The HTTP request object, containing the message ID in the params and updated data in the body.
     * @param res - The HTTP response object.
     * @param next - Function to pass errors to the middleware.
     * @returns A response with the updated message or an error.
     */
    public put = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
          const message = await this.messageService.findOneById(req.params.id);
    
          // If no message found, throw a NotFoundError
          if (!message) {
            throw new NotFoundError(`Message with ID ${req.params.id} not found.`);
          }
    
          // Update the message and return the updated object
          const updatedMessage = await this.messageService.update(
            req.params.id,
            req.body
          );
    
          return res.json(updatedMessage);
        } catch (error) {
          next(error);
        }
      }

    /**
     * DELETE /messages/:id
     * Deletes a specific message by its unique ID.
     * 
     * @param req - The HTTP request object, containing the ID in the params.
     * @param res - The HTTP response object.
     * @param next - Function to pass errors to the middleware.
     * @returns A response confirming the deletion or an error.
     */
    public deleteById = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
          const result = await this.messageService.delete(req.params.id);
    
          // If no message was deleted, throw a NotFoundError
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
