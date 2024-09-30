import User from "../../Auth/model/User";
import Sector from "../model/Sector";
import ProjectRequest from "../model/ProjectRequest";

/**
 * Data Transfer Object (DTO) for Project entities.
 * This class is used to encapsulate data when transferring information about projects between layers of the application.
 */
export default class ProjectDto { 

  /**
   * The name of the project.
   * This is a required field when creating or updating a project.
   *
   * @type {string}
   */
  name: string;

    /**
   * The project request associated with the project.
   * This represents a one-to-one relationship and is required.
   *
   * @type {ProjectRequest}
   */
    projectRequested: ProjectRequest;

  
  /**
   * The list of sectors related to the project.
   * Sectors are represented as `Sector` entities and can be optional.
   *
   * @type {Sector[] | undefined}
   */
  sectors?: Sector[];

  /**
   * The list of coordinators associated with the project.
   * Coordinators are represented as `User` entities and can be optional.
   *
   * @type {User[] | undefined}
   */
  coordinators?: User[];

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
    this.name = name;
    this.projectRequested = projectRequested;
    this.sectors = sectors;
    this.coordinators = coordinators;
  }
}
