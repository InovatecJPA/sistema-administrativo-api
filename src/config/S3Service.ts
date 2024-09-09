import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand, S3ClientConfig } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Extend S3ClientConfig to include optional endpoint and forcePathStyle properties
interface ExtendedS3ClientConfig extends S3ClientConfig {
  endpoint?: string;
  forcePathStyle?: boolean;
}

// Environment variables
const minioUrl = process.env.MINIO_URL;
const accessKey = process.env.MINIO_ACCESS_KEY;
const secretKey = process.env.MINIO_SECRET_KEY;
const bucketName = process.env.MINIO_BUCKET_NAME;

/**
 * Class to handle interactions with AWS S3 or MinIO using presigned URLs.
 */
export class S3Service {
  private s3Client: S3Client;

  /**
   * Initializes the S3Service class with S3Client configuration.
   */
  constructor() {
    // Define S3 client configuration with extended type
    const s3ClientConfig: ExtendedS3ClientConfig = {
      region: "us-east-2",
      credentials: {
        accessKeyId: accessKey || 'YOUR_DEFAULT_ACCESS_KEY', // Replace with a default or env-based key
        secretAccessKey: secretKey || 'YOUR_DEFAULT_SECRET_KEY', // Replace with a default or env-based key
      },
    };

    // Check if MinIO is used and configure endpoint and path style
    if (minioUrl) {
      s3ClientConfig.endpoint = minioUrl;
      s3ClientConfig.forcePathStyle = true;
    }

    // Create an S3Client instance
    this.s3Client = new S3Client(s3ClientConfig);
  }

  /**
   * Generates a presigned URL to delete an object from the bucket.
   * @param fileName - The name of the file to delete.
   * @returns A promise that resolves to the presigned URL or null if fileName is not provided.
   */
  public async deleteWithPresignedUrl(fileName: string): Promise<string | null> {
    if (fileName) {
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: fileName,
      });
      return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    } else {
      return null;
    }
  }

  /**
   * Generates a presigned URL to retrieve an object from the bucket.
   * @param fileName - The name of the file to retrieve.
   * @param fileType - The MIME type of the file.
   * @returns A promise that resolves to the presigned URL or null if fileName is not provided.
   */
  public async getWithPresignedUrl(fileName: string, fileType: string): Promise<string | null> {
    if (fileName) {
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        ResponseContentType: fileType,
      });
      return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    } else {
      return null;
    }
  }

  /**
   * Generates a presigned URL to upload an object to the bucket.
   * @param fileName - The name of the file to upload.
   * @param fileType - The MIME type of the file.
   * @returns A promise that resolves to the presigned URL or null if fileName is not provided.
   */
  public async putWithPresignedUrl(fileName: string, fileType: string): Promise<string | null> {
    if (fileName) {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        ContentType: fileType,
      });
      return await getSignedUrl(this.s3Client, command, { expiresIn: 300 });
    } else {
      return null;
    }
  }
}

// Create an instance of S3Service and export it
export const s3Service: S3Service = new S3Service();