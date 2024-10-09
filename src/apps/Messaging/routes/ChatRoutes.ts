import { Router } from "express";
import { authMiddleware } from "../../../middlewares/auth";
import validateResponseMiddleware from "../../../middlewares/validateResponse";
import chatController from "../controller/ChatController";

// Create a router instance for handling chat-related routes
const chatRouter: Router = Router();

// Middleware for validating responses
chatRouter.use(validateResponseMiddleware);

/**
 * POST /chats/post
 * Route to create a new chat. Protected by authentication middleware.
 *
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller chatController.createChat - Handles the logic of creating a chat.
 */
chatRouter.post("/post", authMiddleware, chatController.createChat);

/**
 * GET /chats/getById/:id
 * Route to retrieve a specific chat by its unique ID. Protected by authentication middleware.
 *
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller chatController.getChatById - Handles the logic of retrieving a chat by its ID.
 */
chatRouter.get("/getById/:id", authMiddleware, chatController.getChatById);

/**
 * GET /chats/getAll
 * Route to retrieve all chats. Protected by authentication middleware.
 *
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller chatController.getAllChats - Handles the logic of retrieving all chats.
 */
chatRouter.get("/getAll", authMiddleware, chatController.getAllChats);

/**
 * PUT /chats/put/:id
 * Route to update a specific chat by its unique ID. Protected by authentication middleware.
 *
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller chatController.updateChat - Handles the logic of updating a chat.
 */
chatRouter.put("/put/:id", authMiddleware, chatController.updateChat);


/**
 * GET /chats/getByName/:name
 * Route to retrieve a specific chat by its name. Protected by authentication middleware.
 *
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller chatController.getByName - Handles the logic of retrieving a chat by its name.
 */
chatRouter.get("/getByName/:name", authMiddleware, chatController.getByName);


/**
 * DELETE /chats/delete/:id
 * Route to delete a specific chat by its unique ID. Protected by authentication middleware.
 *
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller chatController.deleteChat - Handles the logic of deleting a chat.
 */
chatRouter.delete("/delete/:id", authMiddleware, chatController.deleteChat);

export default chatRouter;
