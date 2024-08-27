import { Repository } from "typeorm";
import Profile from "../model/Profile";
import ProfileDTO from "../dto/ProfileDTO";
import AppDataSource from "../../../database/dbConnection";

export class ProfileService {
  private profileRepository: Repository<Profile>;

  constructor(profileRepository: Repository<Profile>) {
    this.profileRepository = profileRepository;
  }

  // buscar um perfil por ID
  public async getProfileById(profileId: string): Promise<ProfileDTO | null> {
    const profile = await this.profileRepository.findOne({
      where: { id: profileId },
    });

    if (!profile) {
      return null;
    }

    return new ProfileDTO(
      profile.id,
      profile.name,
      profile.description,
      profile.isAdmin,
      profile.created_at,
      profile.updated_at
    );
  }

  // buscar perfil por nome
  public async getProfileByName(name: string): Promise<ProfileDTO | null> {
    const profile = await this.profileRepository.findOne({ where: { name } });

    if (!profile) {
      return null;
    }

    return new ProfileDTO(
      profile.id,
      profile.name,
      profile.description,
      profile.isAdmin,
      profile.created_at,
      profile.updated_at
    );;
  }

  // Método para criar um novo perfil
  public async createProfile(profileDTO: ProfileDTO): Promise<ProfileDTO> {
    const profile = this.profileRepository.create({
      name: profileDTO.name,
      description: profileDTO.description,
      isAdmin: profileDTO.isAdmin,
    });

    await this.profileRepository.save(profile);

    return new ProfileDTO(
      profile.id,
      profile.name,
      profile.description,
      profile.isAdmin,
      profile.created_at,
      profile.updated_at
    );
  }

  // Método para atualizar um perfil existente
  public async updateProfile(
    profileId: string,
    profileDTO: ProfileDTO
  ): Promise<ProfileDTO | null> {
    const profile = await this.profileRepository.findOne({
      where: { id: profileId },
    });

    if (!profile) {
      return null;
    }

    profile.name = profileDTO.name ?? profile.name;
    profile.description = profileDTO.description ?? profile.description;
    profile.isAdmin =
      profileDTO.isAdmin !== undefined ? profileDTO.isAdmin : profile.isAdmin;

    await this.profileRepository.save(profile);

    return new ProfileDTO(
      profile.id,
      profile.name,
      profile.description,
      profile.isAdmin,
      profile.created_at,
      profile.updated_at
    );
  }

  // Método para deletar um perfil por ID
  public async deleteProfile(profileId: string): Promise<boolean> {
    const result = await this.profileRepository.delete(profileId);
    return result.affected !== undefined && result.affected > 0;
  }
}

const profileRepository: Repository<Profile> =
  AppDataSource.getRepository(Profile);

export const profileService = new ProfileService(profileRepository);
