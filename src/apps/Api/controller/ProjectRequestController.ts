import { NextFunction, Request, Response } from "express";
import { CustomValidationError } from "../../../error/CustomValidationError";
import { NotFoundError } from "../../../error/NotFoundError";
import ProjectRequestDto from "../dto/ProjectRequestDto";
import ProjectRequest from "../model/ProjectRequest";
import {
  projectRequestService,
  ProjectRequestService,
} from "../service/ProjectRequestService";

export class ProjectRequestController {
  private readonly projectRequestService: ProjectRequestService;

  constructor(projectRequestService: ProjectRequestService) {
    this.projectRequestService = projectRequestService;
  }

  /**
   * Handles POST request to create a new project request.
   */
  public post = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { user, description, attachedFile } = req.body;
      const projectRequestDto: ProjectRequestDto = new ProjectRequestDto(
        // user,
        description,
        attachedFile
      );

      // Validate project request DTO
      if (!projectRequestDto.isValid()) {
        throw new CustomValidationError(
          "User and description are required for the project request."
        );
      }

      // Save new project request using service
      const savedProjectRequest: ProjectRequest =
        await this.projectRequestService.save(
          projectRequestDto.toProjectRequest()
        );

      return res.status(201).json(savedProjectRequest);
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Handles GET request to find a project request by its ID.
   */
  public getById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const projectRequest: ProjectRequest =
        await this.projectRequestService.findOneById(id);

      return res.status(200).json(projectRequest);
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Handles GET request to retrieve all project requests.
   */
  public getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const projectRequests: ProjectRequest[] =
        await this.projectRequestService.findAll();
      return res.status(200).json(projectRequests);
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Handles PUT request to update a project request by its ID.
   */
  public put = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const { user, description, attachedFile } = req.body;
      const projectRequestDto: ProjectRequestDto = new ProjectRequestDto(
        // user,
        description,
        attachedFile
      );

      // Validate project request DTO
      if (!projectRequestDto.isValid()) {
        throw new CustomValidationError(
          "User and description are required for the project request."
        );
      }

      // Find and update project request
      const updatedProjectRequest: ProjectRequest =
        await this.projectRequestService.update(
          id,
          projectRequestDto.toProjectRequest()
        );

      return res.status(200).json(updatedProjectRequest);
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Handles DELETE request to remove a project request by its ID.
   */
  public deleteById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const result = await this.projectRequestService.delete(req.params.id);

      if (result.affected === 0) {
        throw new NotFoundError(
          `Project request with ID ${req.params.id} not found.`
        );
      }

      return res.json({ message: "Project request deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
}

// Initialize the controller with the service
export default new ProjectRequestController(projectRequestService);
