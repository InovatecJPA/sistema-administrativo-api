import Sector from "../model/Sector";

/**
 * Data Transfer Object (DTO) for Sector entities.
 * This class is used to encapsulate data when transferring information about sectors between layers of the application.
 */
export default class SectorDto {
  /**
   * @private
   * Private ID of the sector.
   */
  private _id?: string;

  /**
   * @private
   * Private name of the sector.
   */
  private _name: string;

  /**
   * Constructor for creating an instance of `SectorDto`.
   *
   * @param {string} name - The name of the sector.
   * @param {string} [id] - Optional ID of the sector.
   */
  constructor(name: string, id?: string) {
    this._name = name;
    this._id = id;
  }

  /**
   * Converts the `SectorDto` instance into a `Sector` entity.
   * This method transforms the DTO into an entity that can be persisted in the database.
   *
   * @returns {Sector} The corresponding `Sector` entity.
   */
  public toSector(): Sector {
    return new Sector(this._name, []);
  }

  /**
   * Getter for the ID of the sector.
   *
   * @returns {string | undefined} The ID of the sector, or undefined if not set.
   */
  public get id(): string | undefined {
    return this._id;
  }

  /**
   * Setter for the ID of the sector.
   *
   * @param {string | undefined} value The new ID of the sector.
   */
  public set id(value: string | undefined) {
    this._id = value;
  }

  /**
   * Getter for the name of the sector.
   *
   * @returns {string} The name of the sector.
   */
  public get name(): string {
    return this._name;
  }

  /**
   * Setter for the name of the sector.
   *
   * @param {string} value The new name of the sector.
   */
  public set name(value: string) {
    this._name = value;
  }

  /**
   * Validates if the current `SectorDto` instance has the required fields set.
   *
   * @returns {boolean} True if the instance is valid, false otherwise.
   */
  public isValid(): boolean {
    return !!this._name;
  }
}
