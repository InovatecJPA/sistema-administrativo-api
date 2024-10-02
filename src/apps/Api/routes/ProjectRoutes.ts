import { Router } from "express";
import { authMiddleware } from "../../../middlewares/auth";
import validateResponseMiddleware from "../../../middlewares/validateResponse";
import projectController from "../controller/ProjectController";

// Create a router instance for handling message-related routes
const projectRouter: Router = Router();

// Middleware for validating responses
projectRouter.use(validateResponseMiddleware);

/**
 * POST /messages/post
 * Route to create a new message. Protected by authentication middleware.
 *
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller projectController.post - Handles the logic of creating a message.
 */
projectRouter.post("/post", authMiddleware, projectController.post);

/**
 * GET /messages/getById/:id
 * Route to retrieve a specific message by its unique ID. Protected by authentication middleware.
 *
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller projectController.getById - Handles the logic of retrieving a message by its ID.
 */
projectRouter.get("/getById/:id", authMiddleware, projectController.getById);

/**
 * GET /messages/getAll
 * Route to retrieve all messages. Protected by authentication middleware.
 *
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller projectController.getAll - Handles the logic of retrieving all messages.
 */
projectRouter.get("/getAll", authMiddleware, projectController.getAll);

/**
 * PUT /messages/put/:id
 * Route to update a specific message by its unique ID. Protected by authentication middleware.
 *
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller projectController.put - Handles the logic of updating a message.
 */
projectRouter.put("/put/:id", authMiddleware, projectController.put);

/**
 * DELETE /messages/delete/:id
 * Route to delete a specific message by its unique ID. Protected by authentication middleware.
 *
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller projectController.deleteById - Handles the logic of deleting a message.
 */
projectRouter.delete(
  "/delete/:id",
  authMiddleware,
  projectController.deleteById
);

/**
 * PUT /projects/:projectId/projectRequests/:projectRequestId
 * Route to update the project request for a specific project by the project request ID.
 * Protected by authentication middleware.
 *
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller projectController.putProjectRequest - Handles the logic of setting the project request for a project.
 */
projectRouter.put(
  "/projects/:projectId/projectRequests/:projectRequestId",
  authMiddleware,
  projectController.putProjectRequest
);

/**
 * POST /projects/:projectId/coordinators/:coordinatorId
 * Route to add a coordinator to a specific project by the coordinator's ID.
 * Protected by authentication middleware.
 *
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller projectController.addCoordinator - Handles the logic of adding a coordinator.
 */
projectRouter.post(
  "/projects/:projectId/coordinators/:coordinatorId",
  authMiddleware,
  projectController.postCoordinator
);

/**
 * DELETE /projects/:projectId/coordinators/:coordinatorId
 * Route to remove a coordinator from a specific project by the coordinator's ID.
 * Protected by authentication middleware.
 *
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller projectController.removeCoordinator - Handles the logic of removing a coordinator.
 */
projectRouter.delete(
  "/projects/:projectId/coordinators/:coordinatorId",
  authMiddleware,
  projectController.deleteCoordinator
);

/**
 * POST /projects/:projectId/sectors/:sectorId
 * Route to add a sector to a specific project by the sector's ID.
 * Protected by authentication middleware.
 *
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller projectController.addSector - Handles the logic of adding a sector to a project.
 */
projectRouter.post(
  "/projects/:projectId/sectors/:sectorId",
  authMiddleware,
  projectController.postSector
);

/**
 * DELETE /projects/:projectId/sectors/:sectorId
 * Route to remove a sector from a specific project by the sector's ID.
 * Protected by authentication middleware.
 *
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller projectController.removeSector - Handles the logic of removing a sector from a project.
 */
projectRouter.delete(
  "/projects/:projectId/sectors/:sectorId",
  authMiddleware,
  projectController.deleteSector
);

export default projectRouter;
