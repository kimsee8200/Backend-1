import { Injectable } from '@nestjs/common';
import { IImageUploadService } from './image-upload.interface';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3ImageUploadService implements IImageUploadService {
  private readonly s3: S3Client;
  private readonly bucketName: string;
  private readonly awsRegion: string;
  private readonly uploadPrefix: string = 's3/uploads/';

  constructor(private readonly configService: ConfigService) {
    this.awsRegion = this.configService.getOrThrow('AWS_REGION');
    this.bucketName = this.configService.getOrThrow('AWS_S3_BUCKET_NAME');
    this.s3 = new S3Client({
      region: this.awsRegion,
      credentials: {
        accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  async save(file: Express.Multer.File): Promise<string> {
    const filename = `${uuidv4()}${path.extname(file.originalname)}`;
    const s3Key = this.uploadPrefix + filename;
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: s3Key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3.send(command);
    return s3Key;
  }

  async saveMany(files: Express.Multer.File[]): Promise<string[]> {
    return Promise.all(files.map((file) => this.save(file)));
  }

  async delete(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    await this.s3.send(command);
  }

  async deleteMany(keys: string[]): Promise<void> {
    if (keys.length === 0) {
      return;
    }
    const command = new DeleteObjectsCommand({
      Bucket: this.bucketName,
      Delete: {
        Objects: keys.map((key) => ({ Key: key })),
        Quiet: false,
      },
    });
    await this.s3.send(command);
  }
}
