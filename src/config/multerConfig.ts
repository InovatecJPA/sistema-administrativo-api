import { Request } from 'express';
import { extname, resolve } from 'path';

import multer, { FileFilterCallback, StorageEngine } from 'multer';

const randomNumber = (): number => Math.floor(Math.random() * 10000 + 10000);

/**
 * Class to configure Multer for file uploads.
 */
export class MulterConfig {
  // Storage configuration for Multer
  private storage: StorageEngine;

  // Function to filter files based on MIME type
  private fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => void;

  /**
   * Initializes a new instance of MulterConfig.
   * Sets up storage and file filtering for Multer.
   */
  constructor() {
    // Configure storage using disk storage engine
    this.storage = multer.diskStorage({
      /**
       * Determines the destination directory for uploaded files.
       * @param req - The request object.
       * @param file - The file object.
       * @param cb - The callback function to indicate the destination.
       */
      destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        // Resolve the path to the 'uploads/images' directory
        cb(null, resolve(__dirname, '..', '..', 'uploads', 'images'));
      },
      /**
       * Determines the filename for the uploaded file.
       * @param req - The request object.
       * @param file - The file object.
       * @param cb - The callback function to indicate the filename.
       */
      filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        // Generate a unique filename based on timestamp, random number, and original file extension
        cb(null, `${Date.now()}_${randomNumber()}${extname(file.originalname)}`);
      },
    });

    // Configure file filter to allow only PNG and JPEG files
    this.fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
      // Check if the file MIME type is either PNG or JPEG
      if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
        // Return an error if the file type is not allowed
        return cb(new multer.MulterError('Arquivo precisa ser do tipo PNG ou JPG.'));
      }
      // Allow the file if it passes the filter
      return cb(null, true);
    };
  }

  /**
   * Provides the Multer configuration object.
   * @returns An object containing storage and file filter settings.
   */
  getMulterConfig() {
    return {
      storage: this.storage,
      fileFilter: this.fileFilter,
    };
  }
}

// Create an instance of MulterConfig and export it
export const multerConfig: MulterConfig = new MulterConfig();
