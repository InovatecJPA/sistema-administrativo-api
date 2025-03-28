import { DeleteResult, FindOptionsWhere, Repository } from "typeorm";
import AppDataSource from "../../../database/dbConnection";
import { InvalidObjectError } from "../../../error/InvalidObjectError";
import { NotFoundError } from "../../../error/NotFoundError";
import ServiceInterface from "../../Auth/interface/ServiceInterface";
import Profile from "../../Auth/model/Profile";
import User from "../../Auth/model/User";
import { userService } from "../../Auth/service/UserService";
import ProjectDto from "../dto/ProjectDto";
import Project from "../model/Project";
import Sector from "../model/Sector";
import { sectorService } from "./SectorService";

export class ProjectService implements ServiceInterface<Project, ProjectDto> {
  private projectRepository: Repository<Project>;

  constructor(projectRepository: Repository<Project>) {
    ("");
    this.projectRepository = projectRepository;
  }

  /**
   * Saves a new project based on the provided DTO.
   * This method checks if the DTO is valid, converts it to a `Project` entity, and persists it to the database.
   *
   * @param {Partial<ProjectDto>} objectDto - The Data Transfer Object (DTO) representing the project to be saved.
   * @throws {InvalidObjectError} - If the DTO is invalid, such as having null or empty fields.
   * @returns {Promise<Project>} - The newly saved project entity.
   */
  async save(objectDto: Partial<ProjectDto>): Promise<Project> {
    // Converte `objectDto` para uma instância completa de `ProjectDto`
    const projectDto = new ProjectDto(
      objectDto.name,
      objectDto.sectors,
      objectDto.coordinators
    );

    // Valida usando o método `isValid`
    if (!projectDto.isValid()) {
      throw new InvalidObjectError(
        'All fields of the new project must be non-null or different of "".'
      );
    }

    const newProject: Project = projectDto.toProject();
    return await this.projectRepository.save(newProject);
  }

  /**
   * Finds a project by a given set of conditions.
   * This method searches for a project in the database based on the provided partial project object.
   *
   * @param {Partial<Project>} object - A partial project object with the conditions for the search.
   * @throws {NotFoundError} - If no project matching the given conditions is found.
   * @returns {Promise<Project>} - The found project entity.
   */
  async findOne(object: Partial<Project>): Promise<Project> {
    const projectRecovered: Project = await this.projectRepository.findOne({
      where: object as FindOptionsWhere<Profile>,
    });

    if (!projectRecovered) {
      throw new NotFoundError("No project found.");
    }
    return projectRecovered;
  }

  /**
   * Finds a project by its unique ID.
   * This method searches the database for a project using the provided project ID.
   *
   * @param {string} id - The unique ID of the project to find.
   * @throws {NotFoundError} - If no project with the specified ID is found.
   * @returns {Promise<Project>} - The found project entity.
   */
  async findOneById(id: string): Promise<Project> {
    const projectRecovered: Project = await this.projectRepository.findOne({
      where: { id },
    });

    if (!projectRecovered) {
      throw new NotFoundError("No project found.");
    }
    return projectRecovered;
  }

  /**
   * Retrieves all projects in the database.
   * This method returns an array of all existing projects.
   *
   * @throws {NotFoundError} - If no projects are found in the database.
   * @returns {Promise<Project[]>} - An array of all project entities.
   */
  async findAll(): Promise<Project[]> {
    const projectsRecovered: Project[] = await this.projectRepository.find({
      relations: ["sectors", "coordinators"],
    });

    if (!projectsRecovered) {
      throw new NotFoundError("No projects found.");
    }
    
    return projectsRecovered;
  }

  /**
   * Updates an existing project based on the provided ID and partial project data.
   * This method updates the project in the database with the new data.
   *
   * @param {string} id - The unique ID of the project to update.
   * @param {Partial<Project>} object - The partial project object with the fields to update.
   * @returns {Promise<Project>} - The updated project entity.
   */
  async update(id: string, object: Partial<Project>): Promise<Project> {
    return await this.projectRepository.save({
      ...object,
      id,
    });
  }

  /**
   * Deletes a project by its unique ID.
   * This method removes the project from the database if it exists.
   *
   * @param {string} id - The unique ID of the project to delete.
   * @throws {NotFoundError} - If no project with the specified ID is found.
   * @returns {Promise<DeleteResult>} - The result of the delete operation, indicating success or failure.
   */
  async delete(id: string): Promise<DeleteResult> {
    const projectToDelete = await this.projectRepository.findOneBy({ id });

    if (!projectToDelete) {
      throw new NotFoundError(`Profile with ID ${id} not found`);
    }

    return await this.projectRepository.delete({ id });
  }

  /**
   * Adds a coordinator to the project based on the coordinator's ID.
   * This method associates a user as a coordinator with the project.
   *
   * @param {string} projectId - The ID of the project to update.
   * @param {string} coordinatorId - The ID of the coordinator (user) to add to the project.
   * @throws {NotFoundError} - If the project or user (coordinator) is not found.
   * @returns {Promise<Project>} - The updated project entity.
   */
  async addCoordinator(
    projectId: string,
    coordinatorId: string
  ): Promise<Project> {
    const project: Project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ["coordinators"],
    });

    if (!project) {
      throw new NotFoundError(`Project with ID ${projectId} not found.`);
    }

    const coordinator: User = await userService.findOne({ id: coordinatorId });

    if (!coordinator) {
      throw new NotFoundError(
        `Coordinator with ID ${coordinatorId} not found.`
      );
    }

    project.coordinators = [...(project.coordinators || []), coordinator];

    return await projectRepository.save(project);
  }

  /**
   * Removes a coordinator from the project based on the coordinator's ID.
   * This method disassociates a user from being a coordinator of the project.
   *
   * @param {string} projectId - The ID of the project to update.
   * @param {string} coordinatorId - The ID of the coordinator (user) to remove from the project.
   * @throws {NotFoundError} - If the project is not found.
   * @returns {Promise<Project>} - The updated project entity.
   */
  async removeCoordinator(
    projectId: string,
    coordinatorId: string
  ): Promise<Project> {
    const project: Project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ["coordinators"],
    });

    if (!project) {
      throw new NotFoundError(`Project with ID ${projectId} not found.`);
    }

    project.coordinators = project.coordinators.filter(
      (coordinator) => coordinator.id !== coordinatorId
    );

    return await projectRepository.save(project);
  }

  async getAllByCoordinatorId(userId: string): Promise<Project[]> {
    const projects = await this.projectRepository.find({
      where: {
        coordinators: {
          id: userId,
        },
      },
    });

    return projects;
  }

  /**
   * Adds a member to the project based on the member's ID.
   * This method associates a user as a member with the project.
   *
   * @param {string} projectId - The ID of the project to update.
   * @param {string} memberId - The ID of the member (user) to add to the project.
   * @throws {NotFoundError} - If the project or user (member) is not found.
   * @returns {Promise<Project>} - The updated project entity.
   */
  async addMember(projectId: string, memberId: string): Promise<Project> {
    const project: Project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ["members"],
    });

    if (!project) {
      throw new NotFoundError(`Project with ID ${projectId} not found.`);
    }

    const member: User = await userService.findOne({ id: memberId });

    if (!member) {
      throw new NotFoundError(`Member with ID ${memberId} not found.`);
    }

    project.members = [...(project.members || []), member];

    return await projectRepository.save(project);
  }

  /**
   * Removes a member from the project based on the member's ID.
   * This method disassociates a user from being a member of the project.
   *
   * @param {string} projectId - The ID of the project to update.
   * @param {string} memberId - The ID of the member (user) to remove from the project.
   * @throws {NotFoundError} - If the project is not found.
   * @returns {Promise<Project>} - The updated project entity.
   */
  async removeMember(projectId: string, memberId: string): Promise<Project> {
    const project: Project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ["members"],
    });

    if (!project) {
      throw new NotFoundError(`Project with ID ${projectId} not found.`);
    }

    project.members = project.members.filter(
      (member) => member.id !== memberId
    );

    return await projectRepository.save(project);
  }

  async getAllByMemberId(userId: string): Promise<Project[]> {
    const projects = await this.projectRepository.find({
      where: {
        members: {
          id: userId,
        },
      },
    });

    return projects;
  }

  /**
   * Adds a sector to the project based on the sector's ID.
   * This method associates a sector with the project.
   *
   * @param {string} projectId - The ID of the project to update.
   * @param {string} sectorId - The ID of the sector to add to the project.
   * @throws {NotFoundError} - If the project or sector is not found.
   * @returns {Promise<Project>} - The updated project entity.
   */
  async addSector(projectId: string, sectorId: string): Promise<Project> {
    const project: Project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ["sectors"],
    });

    if (!project) {
      throw new NotFoundError(`Project with ID ${projectId} not found.`);
    }

    const sector: Sector = await sectorService.findOne({ id: sectorId });

    if (!sector) {
      throw new NotFoundError(`Sector Request with ID ${sectorId} not found.`);
    }

    project.sectors = [...(project.sectors || []), sector];

    return await projectRepository.save(project);
  }

  /**
   * Removes a sector from the project based on the sector's ID.
   * This method disassociates a sector from the project.
   *
   * @param {string} projectId - The ID of the project to update.
   * @param {string} sectorId - The ID of the sector to remove from the project.
   * @throws {NotFoundError} - If the project is not found.
   * @returns {Promise<Project>} - The updated project entity.
   */
  async removeSector(projectId: string, sectorId: string): Promise<Project> {
    const project: Project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ["sectors"],
    });

    if (!project) {
      throw new NotFoundError(`Project with ID ${projectId} not found.`);
    }

    project.sectors = project.sectors.filter(
      (sector) => sector.id !== sectorId
    );

    return await projectRepository.save(project);
  }
}

// Initialize the repository and export the service instance
const projectRepository: Repository<Project> =
  AppDataSource.getRepository(Project);
export const projectService: ProjectService = new ProjectService(
  projectRepository
);
