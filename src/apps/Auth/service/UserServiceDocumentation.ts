import { FindOptionsWhere, Repository } from "typeorm";

import moment from "moment";
import AppDataSource from "../../../database/dbConnection";
import { AlreadyExistsError } from "../../../error/AlreadyExistsError";
import { NotFoundError } from "../../../error/NotFoundError";
import { UnauthorizedException } from "../../../error/UnauthorizedException";
import Profile from "../model/Profile";
import User from "../model/User";
import { createUserDTO, UpdateUserDTO } from "../schemas/userSchemas";
import { profileService, ProfileService } from "./ProfileService";

type UserSearchCriteria = Omit<User, "hashPassword" | "someOtherMethod">;

/**
 * UserService handles operations related to User entity management, including
 * finding users, creating new users, updating user information, and paginating user listings.
 */
export class UserService {
  private readonly userRepository: Repository<User>; // Repository to handle User entity database operations
  private readonly profileService: ProfileService; // Service to manage Profile operations

  /**
   * Constructor to initialize the UserService with the necessary repositories and services.
   * @param userRepository - Repository for User entity to handle database operations.
   * @param profileService - Instance of the ProfileService to handle profile-related operations.
   */
  constructor(
    userRepository: Repository<User>,
    profileService: ProfileService
  ) {
    this.userRepository = userRepository;
    this.profileService = profileService;
  }

  /**
   * Retrieves all users from the database.
   * @returns A promise that resolves to an array of all User entities.
   */
  public async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  /**
   * Finds a user based on specific criteria.
   * The search criteria is a partial match to the User entity excluding sensitive fields like passwords.
   *
   * @param conditions - The criteria to search for a user.
   * @returns A promise that resolves to a User entity or null if not found.
   */
  public async findOne(
    conditions: Partial<UserSearchCriteria>
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: conditions as FindOptionsWhere<User>,
      relations: ["profile"], // Include associated profile in the result
    });

    return user ? user : null;
  }

  /**
   * Creates a new user based on provided data, ensuring no duplicate email, CPF, or phone number exists.
   * If the user does not provide a profile, a default profile is assigned.
   *
   * @param _user - Data for creating a new user (createUserDTO).
   * @returns A promise that resolves to the newly created User entity.
   * @throws AlreadyExistsError if the email, CPF, or phone number already exists.
   */
  public async createUser(_user: createUserDTO): Promise<User> {
    // Check if a user with the same email, CPF, or phone already exists
    if (
      await this.userRepository.findOne({
        where: [
          { email: _user.email },
          { cpf: _user.cpf },
          { phone: _user.phone },
        ],
      })
    ) {
      throw new AlreadyExistsError("Usuário já cadastrado.");
    }

    let profile: Profile = null;

    // If profileName is provided, find the associated profile
    if (_user.profileName) {
      profile = await this.profileService.findOne({ name: _user.profileName });
    } else {
      // Use default profile if none is provided
      profile = await this.profileService.findOne({ name: "default_user" });

      // Create the default profile if it doesn't exist
      if (!profile) {
        profile = await this.profileService.createProfile({
          name: "default_user",
          description: "Permissão de usuário padrão do sistema",
        });
      }
    }

    // Create a new User entity
    const user = this.userRepository.create({
      cpf: _user.cpf,
      name: _user.name,
      email: _user.email,
      profile: profile,
      phone: _user.phone,
      isActive: true,
    });

    user.password = _user.password!; // Assign the password

    return await this.userRepository.save(user);
  }

  /**
   * Updates an existing user's information based on either user ID or User entity.
   * The profile cannot be updated using this method; a separate method is used for that.
   *
   * @param userOrUserId - The ID of the user or the User entity to be updated.
   * @param data - The data to update the user with.
   * @returns A promise that resolves to the updated User entity.
   * @throws NotFoundError if the user is not found.
   * @throws UnauthorizedException if attempting to update the profile through this method.
   */
  public async updateUser(userId: string, data: UpdateUserDTO): Promise<User>;
  public async updateUser(user: User): Promise<User>;

  public async updateUser(
    userOrUserId: string | User,
    data?: UpdateUserDTO
  ): Promise<User> {
    if (typeof userOrUserId === "string") {
      // If userOrUserId is a string, treat it as a user ID
      const user = await this.userRepository.findOneBy({ id: userOrUserId });

      if (!user) {
        throw new NotFoundError("Usuário não encontrado.");
      }

      // Disallow profile updates via this method
      if (data?.profile !== undefined) {
        throw new UnauthorizedException("Atualização de perfil não permitida.");
      }

      // Merge data into user entity
      Object.assign(user, data);

      return await this.userRepository.save(user);
    } else {
      // If userOrUserId is a User entity
      const user = userOrUserId;
      await user.hashPassword(); // Hash the password before saving
      return await this.userRepository.save(user);
    }
  }

  /**
   * Updates the profile of a specific user.
   *
   * @param userId - The ID of the user whose profile needs to be updated.
   * @param profileId - The ID of the profile to associate with the user.
   * @returns A promise that resolves to the updated User entity.
   * @throws NotFoundError if the user or profile is not found.
   */
  public async updateUserProfile(
    userId: string,
    profileId: string
  ): Promise<User> {
    // Find the user by ID
    const user = await this.findOne({ id: userId });

    if (!user) {
      throw new NotFoundError("Usuário não encontrado");
    }

    // Find the profile by ID
    const profile = await this.profileService.findOne({ id: profileId });

    if (!profile) {
      throw new NotFoundError("Perfil não encontrado");
    }

    user.profile = profile;

    await this.userRepository.save(user);

    return user;
  }

  /**
   * Retrieves users in a paginated format, limited to 10 users per page.
   * Currently, filter options are not implemented.
   *
   * @param page - The page number to retrieve.
   * @returns A promise that resolves to an object containing the list of users and pagination metadata.
   */
  public async findAllPaginated(page: number) {
    const limit = 10;
    const offset = (page - 1) * limit;

    // Retrieve users with their count for pagination
    const [users, countUser] = await this.userRepository.findAndCount({
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        phone: true,
        cpf: true,
        createdAt: true,
        updatedAt: true,
      },
      relations: {
        profile: true,
      },
      order: {
        id: "ASC",
      },
      skip: offset,
      take: limit,
    });

    const lastPage = Math.ceil(countUser / limit); // Calculate the last page number

    // Create pagination metadata
    const pagination = {
      path: "/users",
      page: page,
      prev_page_url: page - 1 >= 1 ? page - 1 : false,
      next_page_url: page + 1 > lastPage ? false : page + 1,
      total: countUser,
    };

    return { listUser: users, pagination: pagination };
  }

  /**
   * Shows detailed information for a specific user by ID.
   *
   * @param userId - The ID of the user to show details for.
   * @returns A promise that resolves to an object containing the user's name, email, CPF, phone, and birth date.
   * @throws NotFoundError if the user is not found.
   */
  public async show(userId: string): Promise<Object> {
    const user = await this.findOne({ id: userId });

    if (!user) {
      throw new NotFoundError("Usuário não encontrado.");
    }

    return {
      name: user.getFirstName(),
      last_name: user.getLastName(),
      email: user.email,
      cpf: user.cpf,
      phone: user.phone,
      birthDate: user.birthDate
        ? moment(user.birthDate).format("DD/MM/YYYY")
        : null,
    };
  }
}

// Create the user repository to be used by UserService
const userRepository: Repository<User> = AppDataSource.getRepository(User);

// Export a singleton instance of UserService for application-wide use
export const userService = new UserService(userRepository, profileService);
