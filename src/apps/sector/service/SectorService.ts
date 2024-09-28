import { Repository } from "typeorm";
import Sector from "../model/Sector";
import AppDataSource from "../../../database/dbConnection";
import { AlreadyExistsError } from "../../../error/AlreadyExistsError";
import { NotFoundError } from "../../../error/NotFoundError";

export class SectorService {
    private readonly sectorRepository: Repository<Sector>;

    constructor(sectorRepository: Repository<Sector>) {
        this.sectorRepository = sectorRepository;
    }

    async findAll(): Promise<Sector[]> {
        return await this.sectorRepository.find();
    }

    public async findOneById(sectorId: string): Promise<Sector | null> {
        const sector = await this.sectorRepository.findOne({
            where: { id: sectorId },
        });
        return sector ? sector : null;
    }

    public async save(_sector: Sector): Promise<Sector> {
        if (
            await this.sectorRepository.findOne({
                where: [{ name: _sector.name }],
            })
        ) {
            throw new AlreadyExistsError("Setor já cadastrado.");
        }

        const sector = this.sectorRepository.create({
            name: _sector.name,
        });
        return await this.sectorRepository.save(sector);
    }

    public async updateSector(
        sectorNameOrId: string | Sector,
    ): Promise<Sector> {
        if (typeof sectorNameOrId === "string") {
            const sector = await this.sectorRepository.findOneBy({ id: sectorNameOrId });

            if (!sector) {
                throw new NotFoundError("Setor não encontrado.");
            }
            return await this.sectorRepository.save(sector);
        } else {
            const sector = sectorNameOrId;
            return await this.sectorRepository.save(sector);
        }
    }

    public async delete(sectorOrSectorId: string | Sector): Promise<Sector> {
        let sector: Sector;

        if (typeof sectorOrSectorId === "string") {
            // Busca o setor pelo ID
            sector = await this.sectorRepository.findOneBy({ id: sectorOrSectorId });

            if (!sector) {
                throw new NotFoundError("Setor não encontrado.");
            }
        } else {
            // Caso o parâmetro seja do tipo Sector
            sector = sectorOrSectorId;
        }

        // Exclui o setor e retorna o setor excluído
        await this.sectorRepository.delete(sector.id);

        return sector; // Retorna o setor que foi excluído
    }
}

// Para criar a instância do SectorService, você pode fazer assim:
const sectorRepository = AppDataSource.getRepository(Sector);
export const sectorService = new SectorService(sectorRepository);
