import User from "../../Auth/model/User";

/**
 * Data Transfer Object (DTO) for ProjectRequest entities.
 * This class is used to transfer data related to project requests between layers of the application.
 */
export default class ProjectRequestDto {

  /**
   * The user who requested the project.
   * This is a required field and represents the user who initiated the project request.
   *
   * @type {User}
   */
  user: User;

  /**
   * Description of the project request.
   * This is a required field that provides information about the project request.
   *
   * @type {string}
   */
  description: string;

  /**
   * The path or URL to the attached file related to the project request.
   * This field is optional and can be undefined if no file is attached.
   *
   * @type {string | undefined}
   */
  attachedFile?: string;

  /**
   * Constructor with all arguments for ProjectRequestDto.
   *
   * @param {User} user - The user who requested the project.
   * @param {string} description - The description of the project request.
   * @param {string | undefined} attachedFile - The optional attached file for the project request.
   */
  constructor(user: User, description: string, attachedFile?: string) {
    this.user = user;
    this.description = description;
    this.attachedFile = attachedFile;
  }
}
