import { FindOptionsWhere, Repository } from "typeorm";

import moment from "moment";
import AppDataSource from "../../../database/dbConnection";
import { AlreadyExistsError } from "../../../error/AlreadyExistsError";
import { NotFoundError } from "../../../error/NotFoundError";
import { UnauthorizedException } from "../../../error/UnauthorizedException";
import ProfileDto from "../dto/ProfileDto";
import Profile from "../model/Profile";
import User from "../model/User";
import {
  createUserDTO,
  Pagination,
  ShowUserDTO,
  UpdateUserDTO,
  UserPaginatedResponse,
} from "../schemas/userSchemas";
import { profileService, ProfileService } from "./ProfileService";
import { grantService } from "./GrantService";

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
  public async findAll(): Promise<ShowUserDTO[]> {
    const users: User[] = await this.userRepository.find({
      relations: ["profile", "sector"],
    });

    const usersToShow: ShowUserDTO[] = users.map((user: User) => {
      return {
        id: user.id,
        cpf: user.cpf,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isActive: user.isActive,
        profile: {
          id: user.profile.id,
          name: user.profile.name,
          description: user.profile.description,
        },
        sector: user.sector
          ? {
              id: user.sector.id,
              name: user.sector.name,
              description: user.sector.description,
            }
          : null,
      };
    });

    return usersToShow;
  }

  /**
   * Retrieves users in a paginated format, limited to 10 users per page.
   * Currently, filter options are not implemented.
   *
   * @param page - The page number to retrieve.
   * @returns A promise that resolves to an object containing the list of users and pagination metadata.
   */
  public async findAllPaginated(page: number): Promise<UserPaginatedResponse> {
    const limit = 10;
    const offset = (page - 1) * limit;

    const [users, countUser] = await this.userRepository.findAndCount({
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        phone: true,
        cpf: true,
      },
      relations: {
        profile: true,
        sector: true,
      },
      order: {
        id: "ASC",
      },
      skip: offset,
      take: limit,
    });

    const lastPage = Math.ceil(countUser / limit);
    const pagination: Pagination = {
      path: "/users",
      page: page,
      prev_page_url: page - 1 >= 1 ? page - 1 : false,
      next_page_url: page + 1 > lastPage ? false : page + 1,
      total: countUser,
    };

    const listUser: ShowUserDTO[] = users.map((user) =>
      ShowUserDTO.parse({
        id: user.id,
        cpf: user.cpf,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isActive: user.isActive,
        profile: {
          id: user.profile.id,
          name: user.profile.name,
          description: user.profile.description,
        },
        sector: user.sector
          ? {
              id: user.sector.id,
              name: user.sector.name,
              description: user.sector.description,
            }
          : null,
      })
    );

    // Retorna os usuários paginados e os metadados de paginação
    return { listUser, pagination };
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
      relations: ["profile", "sector"],
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

    if (_user.profileName) {
      profile = await this.profileService.findOne({ name: _user.profileName });
    } else {
      profile = await this.profileService.findOne({ name: "default_user" });

      if (!profile) {
        const newDefaultProfile: ProfileDto = new ProfileDto(
          "default_user",
          "Permissão de usuário padrão do sistema"
        );
        profile = await this.profileService.save(newDefaultProfile);
      }
    }

    const user = this.userRepository.create({
      cpf: _user.cpf,
      name: _user.name,
      email: _user.email,
      profile: profile,
      phone: _user.phone,
      isActive: true,
    });

    user.password = _user.password!;

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
      const user = await this.userRepository.findOneBy({ id: userOrUserId });

      if (!user) {
        throw new NotFoundError("Usuário não encontrado.");
      }

      if (data?.profile !== undefined) {
        throw new UnauthorizedException("Atualização de perfil não permitida.");
      }

      // Merge data into user entity
      Object.assign(user, data);

      return await this.userRepository.save(user);
    } else {
      const user = userOrUserId;
      await user.hashPassword();
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
    const user = await this.findOne({ id: userId });

    if (!user) {
      throw new NotFoundError("Usuário não encontrado");
    }

    const profile = await this.profileService.findOne({ id: profileId });

    if (!profile) {
      throw new NotFoundError("Perfil não encontrado");
    }

    user.profile = profile;

    await this.userRepository.save(user);

    return user;
  }

  public async addGrantToUser(userId: string, grantId: string): Promise<User> {
    const user = await this.findOne({ id: userId });

    if (!user) {
      throw new NotFoundError(`User with ID ${ userId } not found.`);
    }

    const grant = await grantService.findOne({ id: grantId });

    if (!grant) {
      throw new NotFoundError(`Grant with ID ${ grantId } not found.`);
    }

    user.grants.push(grant);

    await this.userRepository.save(user);

    return user;
  }

  public async removeGrantFromUser(userId: string, grantId: string): Promise<User> {
    const user = await this.findOne({ id: userId });

    if (!user) {
      throw new NotFoundError(`User with ID ${ userId } not found.`);
    }

    const grant = await grantService.findOne({ id: grantId });

    if (!grant) {
      throw new NotFoundError(`Grant with ID ${ grantId } not found.`);
    }

    user.grants = user.grants.filter((g) => g.id !== grant.id);

    await this.userRepository.save(user);

    return user;
  }

  /**
   * Shows detailed information for a specific user by ID.
   *
   * @param userId - The ID of the user to show details for.
   * @returns A promise that resolves to an object containing the user's name, email, CPF, phone, and birth date.
   * @throws NotFoundError if the user is not found.
   */
  public async show(userId: string): Promise<ShowUserDTO> {
    const user: User = await this.findOne({ id: userId });

    if (!user) {
      throw new NotFoundError("Usuário não encontrado.");
    }
    console.log(user);

    return {
      id: user.id,
      cpf: user.cpf,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isActive: user.isActive,
      profile: {
        id: user.profile.id,
        name: user.profile.name,
        description: user.profile.description,
      },
      sector: user.sector
        ? {
            id: user.sector.id,
            name: user.sector.name,
            description: user.sector.description,
          }
        : null,
    };
  }

  public async delete(userId: string): Promise<void> {
    const user: User | null = await userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError("Usuário não encontrado.");
    }

    await userRepository.update(user.id, { isActive: false });
  }
}

// Create the user repository to be used by UserService
const userRepository: Repository<User> = AppDataSource.getRepository(User);

// Export a singleton instance of UserService for application-wide use
export const userService = new UserService(userRepository, profileService);
