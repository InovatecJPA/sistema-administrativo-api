import { Repository } from "typeorm";
import Profile from "../model/Profile";
import AppDataSource from "../../../database/dbConnection";
import {storeProfile} from "../dto/ProfileDTO";

export class ProfileService {
  private profileRepository: Repository<Profile>;

  constructor(profileRepository: Repository<Profile>) {
    this.profileRepository = profileRepository;
  }

  // buscar um perfil por ID
  public async getProfileById(profileId: string): Promise<Profile| null> {
    const profile = await this.profileRepository.findOne({
      where: { id: profileId },
    });

    return profile ? profile : null;
  }

  // buscar perfil por nome
  public async getProfileByName(name: string): Promise<Profile | null> {
    const profile = await this.profileRepository.findOne({ where: { name } });

    return profile ? profile : null;
  }

  // Método para criar um novo perfil
  public async createProfile(_profile: storeProfile): Promise<Profile | null> {
    try {
      console.log(_profile);
      const profile = this.profileRepository.create({
        name: _profile.name,
        description: _profile.description,
      });

      await this.profileRepository.save(profile);

      return profile;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  // Método para atualizar um perfil existente

  // Método para deletar um perfil
}

const profileRepository: Repository<Profile> =
  AppDataSource.getRepository(Profile);

export const profileService = new ProfileService(profileRepository);
