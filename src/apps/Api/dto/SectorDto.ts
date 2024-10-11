import Sector from "../model/Sector";

/**
 * Data Transfer Object (DTO) for Sector entities.
 * This class is used to encapsulate data when transferring information about sectors between layers of the application.
 */
export default class SectorDto {
  /**
   * @public
   * Private ID of the sector.
   */
  public id?: string;

  /**
   * @public
   * Private name of the sector.
   */
  public name: string;

  /**
   * @public
   * Private description of the sector.
   */
  public description?: string;

  /**
   * Constructor for creating an instance of `SectorDto`.
   *
   * @param {string} name - The name of the sector.
   * @param {string} [id] - Optional ID of the sector.
   */
  constructor(name: string, description?: string, id?: string) {
    this.name = name;
    this.description = "Default description.";
    this.id = id;
  }

  /**
   * Converts the `SectorDto` instance into a `Sector` entity.
   * This method transforms the DTO into an entity that can be persisted in the database.
   *
   * @returns {Sector} The corresponding `Sector` entity.
   */
  public toSector(): Sector {
    return new Sector(this.name, this.description);
  }

  /**
   * Validates if the current `SectorDto` instance has the required fields set.
   *
   * @returns {boolean} True if the instance is valid, false otherwise.
   */
  public isValid(): boolean {
    return !!this.name && !!this.description;
  }
}
