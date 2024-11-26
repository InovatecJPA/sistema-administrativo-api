import { DeleteResult, Repository } from "typeorm";
import AppDataSource from "../../../database/dbConnection";
import { InvalidObjectError } from "../../../error/InvalidObjectError";
import { Attachment } from "../model/Attachment";

export class AttachmentService {
  private attachmentRepository: Repository<Attachment>;

  constructor(attachmentRepository: Repository<Attachment>) {
    this.attachmentRepository = attachmentRepository;
  }

  /**
  * Create and save a new attachment
  * @param fileName - The name of the file
  * @param mimeType - The MIME type of the file
  * @param data - The binary data (Buffer) of the file
  * @returns The saved attachment
  */
  async createAttachment(
    fileName: string,
    mimeType: string,
    data: Buffer
  ): Promise<Attachment> {
    try {
      console.log("Creating attachment...");
      console.log(fileName, mimeType, data);
      if (!fileName || !mimeType || !data) {
        throw new InvalidObjectError("Invalid attachment data.");
      }

      console.log("Creating attachment object...");
      const attachment = this.attachmentRepository.create({
        fileName,
        mimeType,
        data,
      });

      // Salvar o attachment no banco de dados
      return await this.attachmentRepository.save(attachment);

    } catch (error) {
      // Em caso de erro, lançar uma exceção com uma mensagem mais detalhada
      throw new Error(`Error creating attachment into database: ${error.message}`);
    }
  }

  /**
   * Find an attachment by ID
   * @param id - The ID of the attachment
   * @returns The found attachment or null if not found
   */
  async findOneById(id: string): Promise<Attachment | null> {
    return await this.attachmentRepository.findOne({ where: { id } });
  }

  /**
   * Retrieve all attachments
   * @returns Array of all attachments
   */
  async findAll(): Promise<Attachment[]> {
    return await this.attachmentRepository.find();
  }

  /**
   * Update an attachment by ID
   * @param id - The ID of the attachment to update
   * @param updateData - Partial attachment data to update
   * @returns The updated attachment
   */
  async update(id: string, updateData: Partial<Attachment>): Promise<Attachment> {
    const existingAttachment = await this.attachmentRepository.findOneBy({ id });

    if (!existingAttachment) {
      throw new InvalidObjectError(`Attachment with ID ${id} not found.`);
    }

    Object.assign(existingAttachment, updateData);

    return await this.attachmentRepository.save(existingAttachment);
  }

  /**
   * Delete an attachment by ID
   * @param id - The ID of the attachment to delete
   */
  async delete(id: string): Promise<DeleteResult> {
    const attachmentToDelete = await this.attachmentRepository.findOneBy({ id });

    if (!attachmentToDelete) {
      throw new InvalidObjectError(`Attachment with ID ${id} not found.`);
    }

    return await this.attachmentRepository.delete({ id });
  }

  /**
   * Retrieve attachments by MIME type
   * @param mimeType - The MIME type to filter attachments
   * @returns Array of attachments with the specified MIME type
   */
  async findByMimeType(mimeType: string): Promise<Attachment[]> {
    return await this.attachmentRepository.find({ where: { mimeType } });
  }
}

// Initialize and export the service instance
const attachmentRepository: Repository<Attachment> = AppDataSource.getRepository(Attachment);

export const attachmentService = new AttachmentService(attachmentRepository);
