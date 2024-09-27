import Grant from "../model/Grant";
import Profile from "../model/Profile";
import User from "../model/User";

/**
 * Data Transfer Object (DTO) for the `Profile` entity.
 * This class is used to transfer data between different layers of the application
 * and to interact with the `Profile` entity.
 */
export default class ProfileDto {
  /**
   * The unique identifier for the profile.
   * This field is optional and may not be set initially.
   * @type {string | undefined}
   * @private
   */
  private id?: string;

  /**
   * The name of the profile.
   * @type {string}
   * @private
   */
  private name: string;

  /**
   * A description of the profile.
   * @type {string}
   * @private
   */
  private description: string;

  /**
   * An optional list of users associated with the profile.
   * @type {User[] | undefined}
   * @private
   */
  private users?: User[];

  /**
   * An optional list of grants associated with the profile.
   * @type {Grant[] | undefined}
   * @private
   */
  private associatedGrants?: Grant[];

  /**
   * Creates an instance of the ProfileDto class.
   *
   * @param {string} name - The name of the profile.
   * @param {string} description - A description of the profile.
   * @param {User[]} [users] - Optional list of users associated with the profile.
   * @param {Grant[]} [associatedGrants] - Optional list of grants associated with the profile.
   */
  constructor(
    name: string,
    description: string,
    users?: User[],
    associatedGrants?: Grant[]
  ) {
    this.name = name;
    this.description = description;
    this.users = users;
    this.associatedGrants = associatedGrants;
  }

  /**
   * Gets the ID of the profile.
   *
   * @returns {string | undefined} The ID of the profile, or `undefined` if not set.
   */
  public getId(): string | undefined {
    return this.id;
  }

  /**
   * Sets the ID of the profile.
   *
   * @param {string} id - The ID of the profile.
   */
  public setId(id: string): void {
    this.id = id;
  }

  /**
   * Gets the name of the profile.
   *
   * @returns {string} The name of the profile.
   */
  public getName(): string {
    return this.name;
  }

  /**
   * Sets the name of the profile.
   * The name must be a non-null and non-empty string.
   *
   * @param {string} name - The new name to set for the profile.
   */
  public setName(name: string): void {
    if (name !== null && name.trim() !== "") this.name = name;
  }

  /**
   * Gets the description of the profile.
   *
   * @returns {string} The description of the profile.
   */
  public getDescription(): string {
    return this.description;
  }

  /**
   * Sets the description of the profile.
   * The description must be a non-null and non-empty string.
   *
   * @param {string} description - The new description to set for the profile.
   */
  public setDescription(description: string): void {
    if (description !== null && description.trim() !== "")
      this.description = description;
  }

  /**
   * Gets the list of users associated with the profile.
   *
   * @returns {User[] | undefined} The list of users, or `undefined` if not set.
   */
  public getUsers(): User[] | undefined {
    return this.users;
  }

  /**
   * Sets the list of users associated with the profile.
   *
   * @param {User[]} users - The list of users to associate with the profile.
   */
  public setUsers(users: User[]): void {
    this.users = users;
  }

  /**
   * Gets the list of grants associated with the profile.
   *
   * @returns {Grant[] | undefined} The list of grants, or `undefined` if not set.
   */
  public getAssociatedGrants(): Grant[] | undefined {
    return this.associatedGrants;
  }

  /**
   * Sets the list of grants associated with the profile.
   *
   * @param {Grant[]} associatedGrants - The list of grants to associate with the profile.
   */
  public setAssociatedGrants(associatedGrants: Grant[]): void {
    this.associatedGrants = associatedGrants;
  }

  /**
   * Checks if the `ProfileDto` instance is valid.
   * The `name` and `description` properties must be non-null and non-empty strings.
   *
   * @returns {boolean} `true` if the `ProfileDto` is valid, otherwise `false`.
   */
  public isValid(): boolean {
    return (
      this.name !== null &&
      this.name.trim() !== "" &&
      this.description !== null &&
      this.description.trim() !== ""
    );
  }

  /**
   * Converts the `ProfileDto` to a `Profile` entity.
   * Creates a new `Profile` entity using the properties of this DTO.
   *
   * @returns {Profile} The `Profile` entity created from this DTO.
   */
  public toProfile(): Profile {
    const profile = new Profile(
      this.name,
      this.description,
      this.users,
      this.associatedGrants
    );
    return profile;
  }
}
