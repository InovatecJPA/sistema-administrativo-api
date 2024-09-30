import { Router } from "express";
import { authMiddleware } from "../../../middlewares/auth";
import validateResponseMiddleware from "../../../middlewares/validateResponse";
import projectRequestController from "../controller/ProjectRequestController";

// Create a router instance for handling project request-related routes
const projectRequestRouter: Router = Router();

// Middleware for validating responses
projectRequestRouter.use(validateResponseMiddleware);

/**
 * POST /project-requests/post
 * Route to create a new project request. Protected by authentication middleware.
 *
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller projectRequestController.post - Handles the logic of creating a project request.
 */
projectRequestRouter.post(
  "/post",
  authMiddleware,
  projectRequestController.post
);

/**
 * GET /project-requests/getById/:id
 * Route to retrieve a specific project request by its unique ID. Protected by authentication middleware.
 *
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller projectRequestController.getById - Handles the logic of retrieving a project request by its ID.
 */
projectRequestRouter.get(
  "/getById/:id",
  authMiddleware,
  projectRequestController.getById
);

/**
 * GET /project-requests/getAll
 * Route to retrieve all project requests. Protected by authentication middleware.
 *
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller projectRequestController.getAll - Handles the logic of retrieving all project requests.
 */
projectRequestRouter.get(
  "/getAll",
  authMiddleware,
  projectRequestController.getAll
);

/**
 * PUT /project-requests/put/:id
 * Route to update a specific project request by its unique ID. Protected by authentication middleware.
 *
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller projectRequestController.put - Handles the logic of updating a project request.
 */
projectRequestRouter.put(
  "/put/:id",
  authMiddleware,
  projectRequestController.put
);

/**
 * DELETE /project-requests/delete/:id
 * Route to delete a specific project request by its unique ID. Protected by authentication middleware.
 *
 * @middleware authMiddleware - Validates if the user is authenticated.
 * @controller projectRequestController.deleteById - Handles the logic of deleting a project request.
 */
projectRequestRouter.delete(
  "/delete/:id",
  authMiddleware,
  projectRequestController.deleteById
);

export default projectRequestRouter;
