import { Router } from "express";
import validateResponseMiddleware from "../../../middlewares/validateResponse";
import { authMiddleware } from "../../../middlewares/auth";
import messageController from "../controller/MessageController";

// Create a router instance for handling message-related routes
const messagesRouter: Router = Router();

// Middleware for validating responses
messagesRouter.use(validateResponseMiddleware);

/**
 * POST /messages/post
 * Route to create a new message. Protected by authentication middleware.
 * 
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller messageController.post - Handles the logic of creating a message.
 */
messagesRouter.post("/post", authMiddleware, messageController.post);

/**
 * GET /messages/getByDate/:sendedAtDay
 * Route to retrieve all messages sent on a specific date. Protected by authentication middleware.
 * 
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller messageController.getByDate - Handles the logic of retrieving messages by date.
 */
messagesRouter.get("/getByDate/:sendedAtDay", authMiddleware, messageController.getByDate);

/**
 * GET /messages/getById/:id
 * Route to retrieve a specific message by its unique ID. Protected by authentication middleware.
 * 
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller messageController.getById - Handles the logic of retrieving a message by its ID.
 */
messagesRouter.get("/getById/:id", authMiddleware, messageController.getById);

/**
 * GET /messages/getAll
 * Route to retrieve all messages. Protected by authentication middleware.
 * 
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller messageController.getAll - Handles the logic of retrieving all messages.
 */
messagesRouter.get("/getAll", authMiddleware, messageController.getAll);

/**
 * PUT /messages/put/:id
 * Route to update a specific message by its unique ID. Protected by authentication middleware.
 * 
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller messageController.put - Handles the logic of updating a message.
 */
messagesRouter.put("/put/:id", authMiddleware, messageController.put);

/**
 * DELETE /messages/delete/:id
 * Route to delete a specific message by its unique ID. Protected by authentication middleware.
 * 
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller messageController.deleteById - Handles the logic of deleting a message.
 */
messagesRouter.delete("/delete/:id", authMiddleware, messageController.deleteById);

export default messagesRouter;
