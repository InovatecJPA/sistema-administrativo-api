import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../../../error/NotFoundError";
import ProjectDto from "../dto/ProjectDto";
import Project from "../model/Project";
import { projectService, ProjectService } from "../service/ProjectService";

export class ProjectController {
  private projectService: ProjectService;

  constructor(projectService: ProjectService) {
    this.projectService = projectService;
  }

  /**
   * POST /projects
   * Creates a new project with the provided data.
   *
   * @param req - The HTTP request object, containing project data in the body.
   * @param res - The HTTP response object.
   * @param next - Function to pass errors to the middleware.
   * @returns A response with the created project or an error.
   */
  public post = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const savedProject: Project = await this.projectService.save(req.body);
      return res.status(201).json(savedProject);
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * PUT /projects/:id
   * Updates an existing project by its ID.
   *
   * @param req - The HTTP request object, containing project ID in the params and updated data in the body.
   * @param res - The HTTP response object.
   * @param next - Function to pass errors to the middleware.
   * @returns A response with the updated project or an error.
   */
  public put = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;

      const updatedProject: Project = await this.projectService.update(
        id,
        req.body
      );
      return res.status(200).json(updatedProject);
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * DELETE /projects/:id
   * Deletes a project by its ID.
   *
   * @param req - The HTTP request object, containing the project ID in the params.
   * @param res - The HTTP response object.
   * @param next - Function to pass errors to the middleware.
   * @returns A response confirming the deletion or an error.
   */
  public deleteById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const result = await this.projectService.delete(req.params.id);

      // If no project was deleted, throw a NotFoundError
      if (result.affected === 0) {
        throw new NotFoundError(`Project with ID ${req.params.id} not found.`);
      }

      return res.json({ message: "Project deleted successfully" });
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * GET /projects/:id
   * Retrieves a specific project by its unique ID.
   *
   * @param req - The HTTP request object, containing the project ID in the params.
   * @param res - The HTTP response object.
   * @param next - Function to pass errors to the middleware.
   * @returns A response with the requested project or an error.
   */
  public getById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const project: Project = await this.projectService.findOneById(
        req.params.id
      );

      // If no project is found, throw a NotFoundError
      if (!project) {
        throw new NotFoundError(`Project with ID ${req.params.id} not found.`);
      }

      return res.status(200).json(project);
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * GET /projects
   * Retrieves all projects from the system.
   *
   * @param req - The HTTP request object.
   * @param res - The HTTP response object.
   * @param next - Function to pass errors to the middleware.
   * @returns A response with the list of all projects.
   */
  public getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const projects = await this.projectService.findAll();
      return res.json(projects);
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Finds and returns a project based on given criteria.
   *
   * @param req - The HTTP request object containing search criteria in the body.
   * @param res - The HTTP response object.
   * @param next - Function to pass errors to the middleware.
   * @returns A response with the found project or an error.
   */
  public findOne = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const projectDto: Partial<ProjectDto> = req.body;
      const project: Project = await this.projectService.findOne(projectDto);

      // If no project is found, throw a NotFoundError
      if (!project) {
        throw new NotFoundError("No project found with the provided criteria.");
      }

      return res.status(200).json(project);
    } catch (error: any) {
      next(error);
    }
  };
}

// Initialize the controller with the service
export default new ProjectController(projectService);
