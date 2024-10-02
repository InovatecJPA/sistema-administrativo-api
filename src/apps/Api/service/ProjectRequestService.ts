import { DeleteResult, FindOptionsWhere, Repository } from "typeorm";
import AppDataSource from "../../../database/dbConnection";
import { InvalidObjectError } from "../../../error/InvalidObjectError";
import { NotFoundError } from "../../../error/NotFoundError";
import ServiceInterface from "../../Auth/interface/ServiceInterface";
import Profile from "../../Auth/model/Profile";
import ProjectRequestDto from "../dto/ProjectRequestDto";
import ProjectRequest from "../model/ProjectRequest";
import { userService } from "../../Auth/service/UserService";
import User from "../../Auth/model/User";

/**
 * Service class for handling `ProjectRequest` operations.
 * Implements the `ServiceInterface` for `ProjectRequest` entities and `ProjectRequestDto`.
 */
export class ProjectRequestService
  implements ServiceInterface<ProjectRequest, ProjectRequestDto>
{
  /**
   * Repository for managing `ProjectRequest` entities.
   */
  private projectRequestRepository: Repository<ProjectRequest>;

  /**
   * Creates an instance of `ProjectService`.
   *
   * @param {Repository<ProjectRequest>} projectRequestRepository - Repository for `ProjectRequest` entities.
   */
  constructor(projectRequestRepository: Repository<ProjectRequest>) {
    this.projectRequestRepository = projectRequestRepository;
  }

  /**
   * Saves a new project to the database based on the provided `ProjectRequestDto`.
   * Throws an error if the DTO is invalid.
   *
   * @param {Partial<ProjectRequestDto>} objectDto - The data transfer object containing project details.
   * @returns {Promise<ProjectRequest>} A promise that resolves with the saved `ProjectRequest` entity.
   * @throws {InvalidObjectError} If the provided DTO is invalid.
   */
  async save(objectDto: Partial<ProjectRequestDto>): Promise<ProjectRequest> {
    if (!objectDto.isValid()) {
      throw new InvalidObjectError(
        'All fields of the new project must be non-null or different from "".'
      );
    }

    const newProject: ProjectRequest = objectDto.toProjectRequest();

    const user: User = await userService.findOne({ id: objectDto.getUser().id });

    if (!user) {
      throw new InvalidObjectError("The user making the Project Request must be valid.");
    }

    newProject.user = user;
    
    return await this.projectRequestRepository.save(newProject);
  }

  /**
   * Finds and returns a project based on given criteria.
   *
   * @param {Partial<ProjectRequest>} object - The criteria to search for a project.
   * @returns {Promise<ProjectRequest>} A promise that resolves with the found `ProjectRequest` entity.
   * @throws {NotFoundError} If no project is found with the given criteria.
   */
  async findOne(object: Partial<ProjectRequest>): Promise<ProjectRequest> {
    const projectRecovered: ProjectRequest =
      await this.projectRequestRepository.findOne({
        where: object as FindOptionsWhere<Profile>,
      });

    if (!projectRecovered) {
      throw new NotFoundError("No project found.");
    }
    return projectRecovered;
  }

  /**
   * Finds and returns a project by its ID.
   *
   * @param {string} id - The ID of the project to find.
   * @returns {Promise<ProjectRequest>} A promise that resolves with the found `ProjectRequest` entity.
   * @throws {NotFoundError} If no project is found with the given ID.
   */
  async findOneById(id: string): Promise<ProjectRequest> {
    const projectRecovered: ProjectRequest =
      await this.projectRequestRepository.findOne({
        where: { id },
      });

    if (!projectRecovered) {
      throw new NotFoundError("No project found.");
    }
    return projectRecovered;
  }

  /**
   * Finds and returns all projects in the database.
   *
   * @returns {Promise<ProjectRequest[]>} A promise that resolves with an array of all `ProjectRequest` entities.
   * @throws {NotFoundError} If no projects are found.
   */
  async findAll(): Promise<ProjectRequest[]> {
    const projectsRecovered: ProjectRequest[] =
      await this.projectRequestRepository.find();

    if (!projectsRecovered) {
      throw new NotFoundError("No projects found.");
    }
    return projectsRecovered;
  }

  /**
   * Updates a project by its ID with the provided data.
   *
   * @param {string} id - The ID of the project to update.
   * @param {Partial<ProjectRequest>} object - The partial data to update the project with.
   * @returns {Promise<ProjectRequest>} A promise that resolves with the updated `ProjectRequest` entity.
   */
  async update(
    id: string,
    object: Partial<ProjectRequest>
  ): Promise<ProjectRequest> {
    return await this.projectRequestRepository.save({
      ...object,
      id,
    });
  }

  /**
   * Deletes a project by its ID.
   *
   * @param {string} id - The ID of the project to delete.
   * @returns {Promise<DeleteResult>} A promise that resolves with the result of the delete operation.
   * @throws {NotFoundError} If no project is found with the given ID.
   */
  async delete(id: string): Promise<DeleteResult> {
    const projectToDelete = await this.projectRequestRepository.findOneBy({
      id,
    });

    if (!projectToDelete) {
      throw new NotFoundError(`Profile with ID ${id} not found`);
    }

    return await this.projectRequestRepository.delete({ id });
  }
}

// Initialize the repository and export the service instance
const projectRequestRepository: Repository<ProjectRequest> =
  AppDataSource.getRepository(ProjectRequest);
export const projectRequestService: ProjectRequestService =
  new ProjectRequestService(projectRequestRepository);
