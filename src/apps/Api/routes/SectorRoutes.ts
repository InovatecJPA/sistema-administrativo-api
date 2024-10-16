import { Router } from "express";
import { authMiddleware } from "../../../middlewares/auth";
import validateResponseMiddleware from "../../../middlewares/validateResponse";
import sectorController from "../controller/SectorController";

// Create a router instance for handling sector-related routes
const sectorRouter: Router = Router();

// Middleware for validating responses
sectorRouter.use(validateResponseMiddleware);

/**
 * POST /sectors/post
 * Route to create a new sector. Protected by authentication middleware.
 *
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller sectorController.post - Handles the logic of creating a sector.
 */
sectorRouter.post("/post", authMiddleware, sectorController.post);

/**
 * GET /sectors/getById/:id
 * Route to retrieve a specific sector by its unique ID. Protected by authentication middleware.
 *
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller sectorController.getById - Handles the logic of retrieving a sector by its ID.
 */
sectorRouter.get("/getById/:id", authMiddleware, sectorController.getById);

/**
 * GET /sectors/getAll
 * Route to retrieve all sectors. Protected by authentication middleware.
 *
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller sectorController.getAll - Handles the logic of retrieving all sectors.
 */
sectorRouter.get("/getAll", authMiddleware, sectorController.getAll);

/**
 * PUT /sectors/put/:id
 * Route to update a specific sector by its unique ID. Protected by authentication middleware.
 *
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller sectorController.put - Handles the logic of updating a sector.
 */
sectorRouter.put("/put/:id", authMiddleware, sectorController.put);

/**
 * DELETE /sectors/delete/:id
 * Route to delete a specific sector by its unique ID. Protected by authentication middleware.
 *
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller sectorController.deleteById - Handles the logic of deleting a sector.
 */
sectorRouter.delete("/delete/:id", authMiddleware, sectorController.deleteById);

sectorRouter.post("/:id/postUser/", authMiddleware, sectorController.postUser);

sectorRouter.delete("/:id/deleteUser", authMiddleware, sectorController.deleteUser);

sectorRouter.post("/:id/postMessage", authMiddleware, sectorController.postMessage);

sectorRouter.delete("/:id/deleteMessage", authMiddleware, sectorController.deleteMessage);

export default sectorRouter;
