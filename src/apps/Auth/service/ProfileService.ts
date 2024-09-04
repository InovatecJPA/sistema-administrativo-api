import Profile from "../model/Profile";
import ProfileDto from "../dto/ProfileDto";
import ServiceInterface from "../interface/ServiceInterface";

import { Repository, DeleteResult } from "typeorm";
import AppDataSource from "../../../database/dbConnection";
import { CustomValidationError } from "../../../error/CustomValidationError";

/**
 * Service class for managing `Profile` entities.
 */
export class ProfileService implements ServiceInterface<Profile, ProfileDto> {
  private profileRepository: Repository<Profile>;

  /**
   * Initializes a new instance of the `ProfileService` class.
   *
   * @param profileRepository - The repository instance to handle `Profile` data operations.
   */
  constructor(profileRepository: Repository<Profile>) {
    this.profileRepository = profileRepository;
  }

  /**
   * Saves a new `Profile` or updates an existing one.
   *
   * @param profileDto - The DTO containing profile data to be saved or updated.
   * @returns The saved or updated `Profile` entity.
   */
  async save(profileDto: ProfileDto): Promise<Profile> {
    const newProfile: Profile = profileDto.toProfile(); 
    return this.profileRepository.save(newProfile);
  }

  /**
   * Finds a `Profile` by given criteria.
   *
   * @param object - Partial criteria to search for a `Profile`.
   * @returns The `Profile` entity matching the criteria, or `null` if not found.
   */
  async findOne(object: Partial<Profile>): Promise<Profile | null> {
    const { id, name } = object;
    return await this.profileRepository.findOne({
      where: {
        id,
        name,
      },
    });
  }

  /**
   * Finds a `Profile` by its ID.
   *
   * @param id - The unique identifier of the `Profile`.
   * @returns The `Profile` entity with the given ID, or `null` if not found.
   */
  async findOneById(id: string): Promise<Profile | null> {
    return await this.profileRepository.findOne({
      where: { id },
    });
  }

  /**
   * Retrieves all `Profile` entities.
   *
   * @returns An array of all `Profile` entities, or an empty array if none found.
   */
  async findAll(): Promise<Profile[]> {
    return await this.profileRepository.find();
  }

  /**
   * Updates an existing `Profile`.
   *
   * @param id - The unique identifier of the `Profile` to update.
   * @param object - Partial data to update the `Profile` with.
   * @returns The updated `Profile` entity.
   */
  async update(id: string, object: Partial<Profile>): Promise<Profile> {
    return this.profileRepository.save({
      ...object,
      id,
    });
  }

  /**
   * Deletes a `Profile` by its ID.
   *
   * @param id - The unique identifier of the `Profile` to delete.
   * @returns The result of the delete operation.
   * @throws `CustomValidationError` if the `Profile` is not found.
   */
  async delete(id: string): Promise<DeleteResult> {
    const profileToDelete = await this.profileRepository.findOneBy({ id });

    if (!profileToDelete) {
      throw new CustomValidationError(`Profile with ID ${id} not found`);
    }

    return await this.profileRepository.delete({ id });
  }
}

// Initialize the repository and export the service instance
const profileRepository: Repository<Profile> = AppDataSource.getRepository(Profile);
export const profileService = new ProfileService(profileRepository);
