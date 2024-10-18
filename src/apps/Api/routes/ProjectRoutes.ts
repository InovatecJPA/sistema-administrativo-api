import { Router } from "express";
import { authMiddleware } from "../../../middlewares/auth";
import validateResponseMiddleware from "../../../middlewares/validateResponse";
import projectController from "../controller/ProjectController";

// Create a router instance for handling message-related routes
const projectRouter: Router = Router();

// Middleware for validating responses
projectRouter.use(validateResponseMiddleware);

/**
 * POST /projects/post
 * Route to create a new message. Protected by authentication middleware.
 *
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller projectController.post - Handles the logic of creating a message.
 */
projectRouter.post("/post", authMiddleware, projectController.post);

/**
 * GET /projects/getById/:id
 * Route to retrieve a specific message by its unique ID. Protected by authentication middleware.
 *
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller projectController.getById - Handles the logic of retrieving a message by its ID.
 */
projectRouter.get("/getById/:id", authMiddleware, projectController.getById);

/**
 * GET /projects/getAll
 * Route to retrieve all projects. Protected by authentication middleware.
 *
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller projectController.getAll - Handles the logic of retrieving all projects.
 */
projectRouter.get("/getAll", authMiddleware, projectController.getAll);

/**
 * PUT /projects/put/:id
 * Route to update a specific message by its unique ID. Protected by authentication middleware.
 *
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller projectController.put - Handles the logic of updating a message.
 */
projectRouter.put("/put/:id", authMiddleware, projectController.put);

/**
 * DELETE /projects/delete/:id
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
 * PUT /projects/:id/projectRequests/:id
 * Route to update the project request for a specific project by the project request ID.
 * Protected by authentication middleware.
 *
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller projectController.putProjectRequest - Handles the logic of setting the project request for a project.
 */
projectRouter.put(
  "/:id/projectRequest",
  authMiddleware,
  projectController.putProjectRequest
);

/**
 * POST /projects/:id/coordinators/:id
 * Route to add a coordinator to a specific project by the coordinator's ID.
 * Protected by authentication middleware.
 *
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller projectController.addCoordinator - Handles the logic of adding a coordinator.
 */
projectRouter.post(
  "/:id/coordinators/",
  authMiddleware,
  projectController.postCoordinator
);

/**
 * DELETE /projects/:id/coordinators/:id
 * Route to remove a coordinator from a specific project by the coordinator's ID.
 * Protected by authentication middleware.
 *
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller projectController.removeCoordinator - Handles the logic of removing a coordinator.
 */
projectRouter.delete(
  "/:id/coordinators",
  authMiddleware,
  projectController.deleteCoordinator
);

projectRouter.get("/coordinator/:id",
  authMiddleware,
  projectController.getAllByCoordinatorId
)

/**
 * POST /projects/:id/members/:id
 * Route to add a member to a specific project by the user's ID.
 * Protected by authentication middleware.
 *
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller projectController.addTeamMember - Handles the logic of adding a member to a project.
 */
projectRouter.post(
  "/:id/members",
  authMiddleware,
  projectController.postMember
);

/**
 * DELETE /projects/:id/members/:id
 * Route to remove a member from a specific project by the user's ID.
 * Protected by authentication middleware.
 *
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller projectController.deleteMember - Handles the logic of removing a member from a project.
 */
projectRouter.delete(
  "/:id/members",
  authMiddleware,
  projectController.deleteMember
);

projectRouter.get("/member/:id",
  authMiddleware,
  projectController.getAllByMemberId
)

/**
 * POST /projects/:id/sectors/:sectorId
 * Route to add a sector to a specific project by the sector's ID.
 * Protected by authentication middleware.
 *
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller projectController.addSector - Handles the logic of adding a sector to a project.
 */
projectRouter.post(
  "/:id/sectors/",
  authMiddleware,
  projectController.postSector
);

/**
 * DELETE /projects/:id/sectors/:sectorId
 * Route to remove a sector from a specific project by the sector's ID.
 * Protected by authentication middleware.
 *
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller projectController.removeSector - Handles the logic of removing a sector from a project.
 */
projectRouter.delete(
  "/:id/sectors",
  authMiddleware,
  projectController.deleteSector
);

export default projectRouter;
