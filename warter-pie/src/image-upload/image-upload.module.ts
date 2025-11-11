import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3ImageUploadService } from './s3-image-upload.service';

@Module({
  imports: [ConfigModule],
  providers: [S3ImageUploadService],
  exports: [S3ImageUploadService],
})
export class ImageUploadModule {}
