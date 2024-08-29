import { Repository } from "typeorm";
import jwtLib from "jsonwebtoken";

import User from "../model/User";
import * as UserDTO from "../interface/userInterfaces";
import ProfileDTO from "../dto/ProfileDTO";
import CpfValidator from "../utils/CpfValidator";

// Dependencia
import { profileService, ProfileService } from "./ProfileService";
import AppDataSource from "../../../database/dbConnection";

export class UserService {
  private userRepository: Repository<User>;
  private profileService: ProfileService;

  constructor(
    userRepository: Repository<User>,
    profileService: ProfileService
  ) {
    this.userRepository = userRepository;
    this.profileService = profileService;
  }

  public async getUserById(userId: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["profile"],
    });

    if (!user) {
      return null;
    }

    return user;
  }

  public async store(
    userDTO: UserDTO.createUserDTO
  ): Promise<{ token: string; user: Object }> {
    let validationErrors: string[] = [];
    try {
      console.log(userDTO);
      //Verifica se nao teve nenum erro de validação
      if (!CpfValidator.validate(userDTO.cpf)) {
        validationErrors.push("CPF inválido");
      }
      if (!userDTO.name) {
        validationErrors.push("Nome é obrigatório");
      }
      if (!userDTO.email) {
        validationErrors.push("Email é obrigatório");
      }
      if (!userDTO.phone) {
        validationErrors.push("Telefone é obrigatório");
      }
      if (!userDTO.password) {
        validationErrors.push("Senha é obrigatória");
      }

      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join("; "));
      }

      // Verifica se user já existe
      if (
        await this.userRepository.findOne({
          where: [
            { email: userDTO.email },
            { cpf: userDTO.cpf },
            { phone: userDTO.phone },
          ],
        })
      ) {
        throw new Error("Usuário já cadastrado.");
      }

      // Processar perfil
      let profile = null;
      if (userDTO.profileName) {
        profile = await this.profileService.getProfileByName(
          userDTO.profileName || null
        );
        if (!profile) {
          profile = await this.profileService.createProfile(
            new ProfileDTO(undefined, userDTO.profileName, "", false)
          );
        }
      } else {
        // Usar perfil padrão se não for fornecido
        profile = await this.profileService.getProfileByName("default_user");
        if (!profile) {
          profile = await this.profileService.createProfile(
            new ProfileDTO(
              undefined,
              "default_user",
              "Permissão de usuário padrão do sistema",
              false
            )
          );
        }
      }

      // Criar novo usuário
      const user = this.userRepository.create({
        cpf: userDTO.cpf,
        name: userDTO.name,
        email: userDTO.email,
        profile: profile.id,
        phone: userDTO.phone,
        isAtivo: true,
      });

      user.password = userDTO.password!;
      //user.profile = profile;

      await this.userRepository.save(user);

      const token = jwtLib.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          profile_id: user.profile.id,
        },
        process.env.TOKEN_SECRET as string,
        {
          expiresIn: process.env.TOKEN_EXPIRATION,
        }
      );

      return {
        token,
        user: {
          name: user.name,
          email: user.email,
        },
      };
    } catch (error: any) {
      throw new Error(error.message || "Erro interno do servidor");
    }
  }

  
}

const userRepository: Repository<User> = AppDataSource.getRepository(User);
export const userService = new UserService(userRepository, profileService);
