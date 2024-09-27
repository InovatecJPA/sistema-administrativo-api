import { Repository } from "typeorm";
import { FindOptionsWhere } from "typeorm";

import User from "../model/User";

// Dependencia
import { profileService, ProfileService } from "./ProfileService";
import AppDataSource from "../../../database/dbConnection";
import Profile from "../model/Profile";
// import helper from "../../mail/helper/mailHelper";
// import { sendMailPromise } from "../../mail/mailer";
import { AlreadyExistsError } from "../../../error/AlreadyExistsError";
import { NotFoundError } from "../../../error/NotFoundError";
import { UpdateUserDTO, createUserDTO } from "../schemas/userSchemas";
import { UnauthorizedException } from "../../../error/UnauthorizedException";
import moment from "moment";

type UserSearchCriteria = Omit<User, "hashPassword" | "someOtherMethod">;

export class UserService {
  private readonly userRepository: Repository<User>;
  private readonly profileService: ProfileService;

  constructor(
    userRepository: Repository<User>,
    profileService: ProfileService
  ) {
    this.userRepository = userRepository;
    this.profileService = profileService;
  }

  public async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  public async findOne(
    conditions: Partial<UserSearchCriteria>
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: conditions as FindOptionsWhere<User>, // Elimina a incompatibilidade de tipos
      relations: ["profile"],
    });

    return user ? user : null;
  }

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
      // Usar perfil padrão se não for fornecido
      profile = await this.profileService.findOne({ name: "default_user" });

      if (!profile) {
        profile = await this.profileService.createProfile({
          name: "default_user",
          description: "Permissão de usuário padrão do sistema",
        });
      }
    }

    // Criar novo usuário
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

  public async updateUser(userId: string, data: UpdateUserDTO): Promise<User>;
  public async updateUser(user: User): Promise<User>;

  public async updateUser(
    userOrUserId: string | User,
    data?: UpdateUserDTO
  ): Promise<User> {
    if (typeof userOrUserId === "string") {
      // Caso o primeiro argumento seja um ID de usuário (string)
      const user = await this.userRepository.findOneBy({ id: userOrUserId });

      if (!user) {
        throw new NotFoundError("Usuário não encontrado.");
      }

      if (data?.profile !== undefined) {
        throw new UnauthorizedException("Atualização de perfil não permitida.");
      }

      Object.assign(user, data);

      return await this.userRepository.save(user);
    } else {
      // Caso o primeiro argumento seja um objeto User
      const user = userOrUserId;
      await user.hashPassword();
      return await this.userRepository.save(user);
    }
  }

  public async updateUserProfile(
    userId: string,
    profileId: string
  ): Promise<User> {
    // Busca o usuário pelo ID
    const user = await this.findOne({ id: userId });

    if (!user) {
      throw new NotFoundError("Usuário não encontrado");
    }

    // Busca o perfil pelo ID
    const profile = await this.profileService.findOne({ id: profileId });

    if (!profile) {
      throw new NotFoundError("Perfil não encontrado");
    }

    user.profile = profile;

    await this.userRepository.save(user);

    return user;
  }

  // paginação de usuários
  // Depois falta implementar opções de filtro
  public async findAllPaginated(page: number) {
    const limit = 10;
    const offset = (page - 1) * limit; // Calcula o deslocamento para a página atual

    // Usa findAndCount para obter a lista de usuários e o total de registros ao mesmo tempo
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

    const lastPage = Math.ceil(countUser / limit); // Calcula o número da última página

    const pagination = {
      path: "/users",
      page: page,
      prev_page_url: page - 1 >= 1 ? page - 1 : false,
      next_page_url: page + 1 > lastPage ? false : page + 1,
      total: countUser,
    };

    return { listUser: users, pagination: pagination };
  }

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

const userRepository: Repository<User> = AppDataSource.getRepository(User);
export const userService = new UserService(userRepository, profileService);
