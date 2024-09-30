import { DeleteResult, FindOptionsWhere, Repository } from "typeorm";
import AppDataSource from "../../../database/dbConnection";
import { InvalidObjectError } from "../../../error/InvalidObjectError";
import { NotFoundError } from "../../../error/NotFoundError";
import ServiceInterface from "../../Auth/interface/ServiceInterface";
import Profile from "../../Auth/model/Profile";
import ProjectDto from "../dto/ProjectDto";
import Project from "../model/Project";

export class ProjectService implements ServiceInterface<Project, ProjectDto> {
  private projectRepository: Repository<Project>;

  constructor(projectRepository: Repository<Project>) {
    ("");
    this.projectRepository = projectRepository;
  }

  async save(objectDto: Partial<ProjectDto>): Promise<Project> {
    if (!objectDto.isValid()) {
      throw new InvalidObjectError(
        'All fields of the new projecyt must be non-null or different of "" .'
      );
    }

    const newProject: Project = objectDto.toProject();
    return await this.projectRepository.save(newProject);
  }

  async findOne(object: Partial<Project>): Promise<Project> {
    const projectRecovered: Project = await this.projectRepository.findOne({
      where: object as FindOptionsWhere<Profile>,
    });

    if (!projectRecovered) {
      throw new NotFoundError("No project found.");
    }
    return projectRecovered;
  }

  async findOneById(id: string): Promise<Project> {
    const projectRecovered: Project = await this.projectRepository.findOne({
      where: { id },
    });

    if (!projectRecovered) {
      throw new NotFoundError("No project found.");
    }
    return projectRecovered;
  }

  async findAll(): Promise<Project[]> {
    const projectsRecovered: Project[] = await this.projectRepository.find();

    if (!projectsRecovered) {
      throw new NotFoundError("No projects found.");
    }
    return projectsRecovered;
  }

  async update(id: string, object: Partial<Project>): Promise<Project> {
    return await this.projectRepository.save({
      ...object,
      id,
    });
  }

  async delete(id: string): Promise<DeleteResult> {
    const projectToDelete = await this.projectRepository.findOneBy({ id });

    if (!projectToDelete) {
      throw new NotFoundError(`Profile with ID ${id} not found`);
    }

    return await this.projectRepository.delete({ id });
  }
}

// Initialize the repository and export the service instance
const projectRepository: Repository<Project> =
  AppDataSource.getRepository(Project);
export const projectService: ProjectService = new ProjectService(
  projectRepository
);
