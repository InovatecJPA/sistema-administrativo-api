import { HttpStatusCode } from "axios";
import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../../../error/NotFoundError";
import ProjectDto from "../dto/ProjectDto";
import Project from "../model/Project";
import { projectService, ProjectService } from "../service/ProjectService";
import { InvalidObjectError } from "../../../error/InvalidObjectError";
import UserController from "../../Auth/controller/UserController";
import { userService } from "../../Auth/service/UserService";
import User from "../../Auth/model/User";
import Sector from "../model/Sector";
import { sectorService } from "../service/SectorService";

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
      const { name, sectors, coordinators, members } = req.body;
      const projectDto: ProjectDto = new ProjectDto(name, sectors, coordinators, members);

      if (!projectDto.isValid()) {
        throw new InvalidObjectError("Project has missing values!");
      }

      const savedProject: Project = await this.projectService.save(projectDto.toProject());

      if (sectors || sectors.length !== 0) {
        coordinators.forEach(async sectorId => {
          const sector: Sector = await sectorService.findOne({ id: sectorId})
          this.projectService.addSector(savedProject.id, sector.id);
        });
      }

      if (coordinators || coordinators.length !== 0) {
        coordinators.forEach(async userId => {
          const user: User = await userService.findOne({ id: userId})
          this.projectService.addCoordinator(savedProject.id, user.id);
        });
      }

      if (members || members.length !== 0) {
        members.forEach(async userId => {
          const user: User = await userService.findOne({ id: userId})
          this.projectService.addMember(savedProject.id, user.id);
        });
      }
      
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
      return res.status(HttpStatusCode.Ok).json(updatedProject);
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

      return res.status(HttpStatusCode.Ok).json(project);
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

      if (!project) {
        throw new NotFoundError("No project found with the provided criteria.");
      }

      return res.status(HttpStatusCode.Ok).json(project);
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * PUT /projects/:id/projectRequests/:projectRequestId
   * Updates the project request for a specific project by its request ID.
   *
   * @param req - The HTTP request object, containing the project ID and request ID in the params.
   * @param res - The HTTP response object.
   * @param next - Function to pass errors to the middleware.
   * @returns A response with the updated project or an error.
   */
  // async putProjectRequest(req: Request, res: Response, next: NextFunction): Promise<Response> {
  //   const { id } = req.params;
  //   const { projectRequestId } = req.body;
    
  //   try {
  //     const updatedProject = await projectService.setProjectRequest(id, projectRequestId);
  //     return res.status(HttpStatusCode.Ok).json(updatedProject);
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  /**
   * POST /projects/:id/coordinators/:coordinatorId
   * Adds a coordinator to a specific project by their user ID.
   *
   * @param req - The HTTP request object, containing the project ID and coordinator ID in the params.
   * @param res - The HTTP response object.
   * @param next - Function to pass errors to the middleware.
   * @returns A response with the updated project or an error.
   */
  async postCoordinator(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const { id } = req.params;
    const { coordinatorId } = req.body;

    try {
      const updatedProject = await projectService.addCoordinator(id, coordinatorId);
      return res.status(HttpStatusCode.Ok).json(updatedProject);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /projects/:id/coordinators
   * Removes a coordinator from a specific project by their user ID.
   *
   * @param req - The HTTP request object, containing the project ID and coordinator ID in the params.
   * @param res - The HTTP response object.
   * @param next - Function to pass errors to the middleware.
   * @returns A response with the updated project or an error.
   */
  async deleteCoordinator(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const { id } = req.params;
    const { coordinatorId } = req.body;

    try {
      const updatedProject = await projectService.removeCoordinator(id, coordinatorId);
      return res.status(HttpStatusCode.Ok).json(updatedProject);
    } catch (error) {
      next(error);
    }
  }

  public getAllByCoordinatorId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const projects = await this.projectService.getAllByCoordinatorId(req.params.id);
      return res.json(projects);
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * POST /projects/:id/members/:memberId
   * Adds a member to the project.
   *
   * @param req - The HTTP request object, containing the project ID and member ID in the params.
   * @param res - The HTTP response object.
   * @param next - Function to pass errors to the middleware.
   * @returns A response with the updated project or an error.
   */
  public postMember = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const { memberId } = req.body;
      const updatedProject: Project = await this.projectService.addMember(id, memberId);
      
      return res.status(HttpStatusCode.Ok).json(updatedProject);
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * DELETE /projects/:id/members
   * Removes a member from the project.
   *
   * @param req - The HTTP request object, containing the project ID and member ID in the params.
   * @param res - The HTTP response object.
   * @param next - Function to pass errors to the middleware.
   * @returns A response with the updated project or an error.
   */
  public deleteMember = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const { memberId } = req.body;

      const updatedProject: Project = await this.projectService.removeMember(id, memberId);
      return res.status(HttpStatusCode.Ok).json(updatedProject);
    } catch (error: any) {
      next(error);
    }
  };

  public getAllByMemberId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { memberId } = req.params;
      const projects: Project[] = await this.projectService.getAllByMemberId(memberId);
      return res.status(HttpStatusCode.Ok).json(projects);
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * POST /projects/:id/sectors
   * Adds a sector to a specific project by its sector ID.
   *
   * @param req - The HTTP request object, containing the project ID and sector ID in the params.
   * @param res - The HTTP response object.
   * @param next - Function to pass errors to the middleware.
   * @returns A response with the updated project or an error.
   */
  async postSector(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const { id } = req.params;
    const { sectorId } = req.body;

    try {
      const updatedProject = await projectService.addSector(id, sectorId);
      return res.status(HttpStatusCode.Ok).json(updatedProject);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /projects/:id/sectors
   * Removes a sector from a specific project by its sector ID.
   *
   * @param req - The HTTP request object, containing the project ID and sector ID in the params.
   * @param res - The HTTP response object.
   * @param next - Function to pass errors to the middleware.
   * @returns A response with the updated project or an error.
   */
  async deleteSector(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const { id } = req.params;
    const { sectorId } = req.body;

    try {
      const updatedProject = await projectService.removeSector(id, sectorId);
      return res.status(HttpStatusCode.Ok).json(updatedProject);
    } catch (error) {
      next(error);
    }
  }

}
// Initialize the controller with the service
export default new ProjectController(projectService);
