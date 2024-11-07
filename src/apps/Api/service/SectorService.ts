import { DeleteResult, FindOptionsWhere, Repository } from "typeorm";
import AppDataSource from "../../../database/dbConnection";
import { InvalidObjectError } from "../../../error/InvalidObjectError";
import { NotFoundError } from "../../../error/NotFoundError";
import ServiceInterface from "../../Auth/interface/ServiceInterface";
import User from "../../Auth/model/User";
import { userService, UserService } from "../../Auth/service/UserService";
import Message from "../../Messaging/model/Message";
import { messageService } from "../../Messaging/service/MessageService";
import SectorDto from "../dto/SectorDto";
import Sector from "../model/Sector";

/**
 * Service class for handling Sector operations.
 * Implements the `ServiceInterface` for `Sector` entities and `SectorDto`.
 */
export class SectorService implements ServiceInterface<Sector, SectorDto> {
  /**
   * Repository for managing sector entities.
   */
  private readonly sectorRepository: Repository<Sector>;

  /**
   * Repository for managing user entities.
   */
  private userService: UserService;

  /**
   * Creates an instance of `SectorService`.
   *
   * @param {Repository<Sector>} sectorRepository - Repository for `Sector` entities.
   */
  constructor(sectorRepository: Repository<Sector>) {
    this.sectorRepository = sectorRepository;
    this.userService = userService;
  }

  /**
   * Saves a new sector to the database.
   * Throws an error if a sector with the same name already exists.
   *
   * @param {Partial<SectorDto>} objectDto - The sector entity to save.
   * @returns {Promise<Sector>} A promise that resolves with the saved `Sector` entity.
   * @throws {InvalidObjectError} If the provided DTO is invalid.
   */
  public async save(objectDto: Partial<SectorDto>): Promise<Sector> {
    if (!objectDto.name || !objectDto.description) {
      throw new InvalidObjectError(
        'All fields of the new sector must be non-null or different from "" .'
      );
    }

    const newSector: Sector = new Sector(objectDto.name, objectDto.description);

    return await this.sectorRepository.save(newSector);
}

  async findOne(object: Partial<Sector>): Promise<Sector> {
    const projectRecovered: Sector = await this.sectorRepository.findOne({
      where: object as FindOptionsWhere<Sector>,
    });

    if (!projectRecovered) {
      throw new NotFoundError("No project found.");
    }
    return projectRecovered;
  }

  /**
   * Finds and returns a sector by its ID.
   *
   * @param {string} sectorId - The ID of the sector to find.
   * @returns {Promise<Sector | null>} A promise that resolves with the `Sector` entity if found, or `null` if not found.
   */
  public async findOneById(sectorId: string): Promise<Sector | null> {
    const sector = await this.sectorRepository.findOne({
      where: { id: sectorId },
      relations: ["users"],
      select: {
        id: true,
        name: true,
        description: true,
        users: {
          id: true,
          name: true,
        }
      }
    });
  
    if (!sector) {
      return null;
    }
  
    const sectorDto = {
      ...sector,
      users: sector.users.map(user => ({
        id: user.id,
        name: user.name
      }))
    };
  
    return sectorDto as Sector; 
  }
  

  /**
   * Finds and returns all sectors in the database.
   *
   * @returns {Promise<Sector[]>} A promise that resolves with an array of all `Sector` entities.
   */
  public async findAll(): Promise<Sector[]> {
    const sectors = await this.sectorRepository.find({
      relations: ["users"],
      select: {
        id: true,
        name: true,
        description: true,
        users: {
          id: true,
          name: true
        }
      }
    });
  

    const sectorsDto = sectors.map(sector => ({
      ...sector,
      users: sector.users.map(user => ({
        id: user.id,
        name: user.name
      }))
    }));
  
    return sectorsDto as Sector[]; 
  }
  

  /**
   * Updates an existing sector based on its ID or entity.
   *
   * @param {string | Sector} sectorNameOrId - The name or ID of the sector, or the `Sector` entity itself.
   * @returns {Promise<Sector>} A promise that resolves with the updated `Sector` entity.
   * @throws {NotFoundError} If a sector with the provided ID is not found.
   */
  public async update(id: string, object: Partial<Sector>): Promise<Sector> {
    return await this.sectorRepository.save({
      ...object,
      id: id,
    });
  }

  /**
   * Deletes a sector based on its ID or entity.
   * Returns the deleted sector.
   *
   * @param {string | Sector} sectorOrSectorId - The ID of the sector, or the `Sector` entity itself.
   * @returns {Promise<Sector>} A promise that resolves with the deleted `Sector` entity.
   * @throws {NotFoundError} If a sector with the provided ID is not found.
   */
  public async deleteByIdOrEntity(
    sectorOrSectorId: string | Sector
  ): Promise<Sector> {
    let sector: Sector;

    if (typeof sectorOrSectorId === "string") {
      sector = await this.sectorRepository.findOneBy({ id: sectorOrSectorId });

      if (!sector) {
        throw new NotFoundError("Setor não encontrado.");
      }
    } else {
      sector = sectorOrSectorId;
    }

    await this.sectorRepository.delete(sector.id);

    return sector;
  }

  /**
   * Deletes a sector by its ID.
   *
   * @param {string} id - The ID of the sector to delete.
   * @returns {Promise<DeleteResult>} A promise that resolves with the result of the delete operation.
   * @throws {NotFoundError} If no sector is found with the provided ID.
   */
  async delete(id: string): Promise<DeleteResult> {
    const sectorToDelete = await this.sectorRepository.findOneBy({ id });

    if (!sectorToDelete) {
      throw new NotFoundError(`Sector with ID ${id} not found`);
    }

    return await this.sectorRepository.delete({ id });
  }

  async addUser(sectorId: string, userId: string): Promise<Sector> {
    const sector: Sector = await this.sectorRepository.findOne({
      where: { id: sectorId },
      relations: ["users"],
    });
  
    if (!sector) {
      throw new NotFoundError(`Sector with ID ${sectorId} not found.`);
    }
  
    const user: User = await userService.findOne({ id: userId });
  
    if (sector.users.some(existingUser => existingUser.id === userId)) {
      throw new Error(`User with ID ${userId} is already part of the sector.`);
    }
  
    // Adiciona o user ao setor e define o setor no user
    sector.users = [...(sector.users || []), user];
    user.sector = sector;
  
    // Salva as duas entidades para garantir que o setor_id seja atualizado no user
    await userService.updateUser(user);  // Salva o user com o sector_id
    const savedSector = await sectorRepository.save(sector);
  
    interface UserDTO {
      id: string;
      name: string;
      email: string;
      phone: string;
    }
  
    const usersDTO: UserDTO[] = savedSector.users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    }));
  
    return {
      ...savedSector,
      users: usersDTO,
    } as Sector;
  }

  async removeUser(sectorId: string, userId: string): Promise<Sector> {
    const sector: Sector = await sectorRepository.findOne({
      where: { id: sectorId },
      relations: ["users"],
    });

    if (!sector) {
      throw new NotFoundError(`Sector with ID ${sectorId} not found.`);
    }

    sector.users = sector.users.filter((user) => user.id !== userId);

    return sectorRepository.save(sector);
  }

  async addMessage(sectorId: string, messageId: string): Promise<Sector> {
    const sector: Sector = await sectorRepository.findOne({
      where: { id: sectorId },
      relations: ["messages"],
    });

    if (!sector) {
      throw new NotFoundError(`Sector with ID ${sectorId} not found.`);
    }

    const message: Message = await messageService.findOneById(sectorId);

    if (!message) {
      throw new NotFoundError(`Message with ID ${messageId} not found.`);
    }

    sector.messages = [...(sector.messages || []), message];

    return sectorRepository.save(sector);
  }

  async removeMessage(sectorId: string, messageId: string): Promise<Sector> {
    const sector: Sector = await sectorRepository.findOne({
      where: { id: sectorId },
      relations: ["messages"],
    });

    if (!sector) {
      throw new NotFoundError(`Sector with ID ${sectorId} not found.`);
    }

    sector.messages = sector.messages.filter(
      (message) => message.id !== messageId
    );

    return sectorRepository.save(sector);
  }
}

// Create an instance of `SectorService` using the sector repository
const sectorRepository = AppDataSource.getRepository(Sector);
export const sectorService = new SectorService(sectorRepository);
