import Grant from "../model/Grant";

/**
 * Data Transfer Object (DTO) for the Grant entity.
 * This class is used to encapsulate data for transfer between different layers of the application.
 */
export default class GrantDto {
  /**
   * The name of the grant.
   * @type {string}
   * @private
   */
  private name: string;

  /**
   * A note or description associated with the grant.
   * @type {string}
   * @private
   */
  private note: string;

  /**
   * An optional filter for the route associated with the grant.
   * @type {string | undefined}
   * @private
   */
  private routeFilter?: string;

  /**
   * The route associated with the grant.
   * @type {string}
   * @private
   */
  private route: string;

  /**
   * Creates an instance of GrantDto.
   *
   * @param {string} name - The name of the grant.
   * @param {string} note - A note or description for the grant.
   * @param {string} route - The route associated with the grant.
   */
  constructor(name: string, note: string, route: string) {
    this.name = name;
    this.note = note;
    this.route = route;
  }

  /**
   * Gets the name of the grant.
   *
   * @returns {string} The name of the grant.
   */
  public getName(): string {
    return this.name;
  }

  /**
   * Sets the name of the grant.
   * The name must be a non-null and non-empty string.
   *
   * @param {string} name - The new name to set.
   */
  public setName(name: string): void {
    if (name !== null && name.trim() !== "") this.name = name;
  }

  /**
   * Gets the note or description of the grant.
   *
   * @returns {string} The note or description of the grant.
   */
  public getNote(): string {
    return this.note;
  }

  /**
   * Sets the note or description of the grant.
   * The note must be a non-null and non-empty string.
   *
   * @param {string} note - The new note to set.
   */
  public setNote(note: string): void {
    if (note !== null && note.trim() !== "") this.note = note;
  }


  /**
   * Gets the route associated with the grant.
   *
   * @returns {string} The route of the grant.
   */
  public getRoute(): string {
    return this.route;
  }

  /**
   * Sets the route for the grant.
   * The route must be a non-null and non-empty string.
   *
   * @param {string} route - The new route to set.
   */
  public setRoute(route: string): void {
    if (route !== null && route.trim() !== "") this.route = route;
  }

  /**
   * Checks if the current DTO has valid and non-empty properties.
   * All properties (name, note, route, and routeFilter) must be non-null and non-empty strings.
   *
   * @returns {boolean} `true` if all properties are valid, otherwise `false`.
   */
  public isValid(): boolean {
    return (
      this.name !== null &&
      this.name.trim() !== "" &&
      this.note !== null &&
      this.note.trim() !== "" &&
      this.route !== null &&
      this.route.trim() !== ""
    );
  }

  /**
   * Converts this DTO into a `Grant` entity.
   *
   * @returns {Grant} A new `Grant` entity instance with properties from this DTO.
   */
  public toGrant(): Grant {
    return new Grant(this.name, this.route, this.note);
  }
}
