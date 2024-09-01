import { Repository } from "typeorm";
import jwtLib from "jsonwebtoken";

import User from "../model/User";
import * as UserDTO from "../dto/user.dto";
import CpfValidator from "../utils/CpfValidator";

// Dependencia
import { profileService, ProfileService } from "./ProfileService";
import AppDataSource from "../../../database/dbConnection";
import Profile from "../model/Profile";
import helper from "../../mail/helper/mailHelper";
import Token from "../model/Token";
import { sendMailPromise } from "../../mail/mailer";
import { AlreadyExistsError } from "../../../error/AlreadyExistsError";
import { NotFoundError } from "../../../error/NotFoundError";

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

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  public async getUserById(userId: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["profile"],
    });

    return user ? user : null;
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ["profile"],
    });

    return user ? user : null;
  }

  public async getByPhone(phone: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { phone },
      relations: ["profile"],
    });

    return user ? user : null;
  }

  public async createUser(_user: UserDTO.createUser): Promise<User> {
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
      profile = await this.profileService.getProfileByName(_user.profileName);
    } else {
      // Usar perfil padrão se não for fornecido
      profile = await this.profileService.getProfileByName("default_user");

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

  public async updateUser(user: User): Promise<User> {
    await user.hashPassword();
    return await this.userRepository.save(user);
  }

  // paginação de usuários
  // Depois falta implementar opções de filtro
  public async getUsersPaginated(page: number) {
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
}

const userRepository: Repository<User> = AppDataSource.getRepository(User);
export const userService = new UserService(userRepository, profileService);
