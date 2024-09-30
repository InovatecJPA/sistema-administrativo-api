import User from "../../Auth/model/User";
import Sector from "../model/Sector";
import ProjectRequest from "../model/ProjectRequest";
import Project from "../model/Project"; // Assuming Project is the entity for the project

/**
 * Data Transfer Object (DTO) for Project entities.
 * This class is used to encapsulate data when transferring information about projects between layers of the application.
 */
export default class ProjectDto {

  /**
   * @private
   * Private name of the project. 
   */
  private _name: string;

  /**
   * @private
   * Private project request associated with the project.
   */
  private _projectRequest: ProjectRequest;

  /**
   * @private
   * Private list of sectors associated with the project.
   */
  private _sectors?: Sector[];

  /**
   * @private
   * Private list of coordinators associated with the project.
   */
  private _coordinators?: User[];

  /**
   * Constructor for creating an instance of `ProjectDto`.
   *
   * @param {string} name - The name of the project.
   * @param {ProjectRequest} projectRequested - The project request associated with the project.
   * @param {Sector[]} [sectors] - Optional array of sectors associated with the project.
   * @param {User[]} [coordinators] - Optional array of coordinators for the project.
   */
  constructor(
    name: string,
    projectRequested: ProjectRequest,
    sectors?: Sector[],
    coordinators?: User[]
  ) {
    this._name = name;
    this._projectRequest = projectRequested;
    this._sectors = sectors;
    this._coordinators = coordinators;
  }

  /**
   * Converts the `ProjectDto` instance into a `Project` entity.
   * This method transforms the DTO into an entity that can be persisted in the database.
   *
   * @returns {Project} The corresponding `Project` entity.
   */
  public toProject(): Project {
    const now: Date = new Date();
    const project = new Project(this.name, this._coordinators, this._sectors, this._projectRequest, now, now);
    return project;
  }

  /**
   * Getter for the name of the project.
   *
   * @returns {string} The name of the project.
   */
  public get name(): string {
    return this._name;
  }

  /**
   * Setter for the name of the project.
   *
   * @param {string} value The new name of the project.
   */
  public set name(value: string) {
    this._name = value;
  }

  /**
   * Getter for the project request associated with the project.
   *
   * @returns {ProjectRequest} The project request.
   */
  public get projectRequest(): ProjectRequest {
    return this._projectRequest;
  }

  /**
   * Setter for the project request associated with the project.
   *
   * @param {ProjectRequest} value The new project request.
   */
  public set projectRequest(value: ProjectRequest) {
    this._projectRequest = value;
  }

  /**
   * Getter for the list of sectors related to the project.
   *
   * @returns {Sector[] | undefined} The list of sectors or undefined if not set.
   */
  public get sectors(): Sector[] | undefined {
    return this._sectors;
  }

  /**
   * Setter for the list of sectors related to the project.
   *
   * @param {Sector[]} value The new list of sectors.
   */
  public set sectors(value: Sector[] | undefined) {
    this._sectors = value;
  }

  /**
   * Getter for the list of coordinators associated with the project.
   *
   * @returns {User[] | undefined} The list of coordinators or undefined if not set.
   */
  public get coordinators(): User[] | undefined {
    return this._coordinators;
  }

  /**
   * Setter for the list of coordinators associated with the project.
   *
   * @param {User[]} value The new list of coordinators.
   */
  public set coordinators(value: User[] | undefined) {
    this._coordinators = value;
  }

  /**
   * Validates if the current `ProjectDto` instance has the required fields set.
   * 
   * @returns {boolean} True if the instance is valid, false otherwise.
   */
  public isValid(): boolean {
    return !!this._name && !!this._projectRequest;
  }
}
