import { Injectable } from '@nestjs/common';
import { IImageUploadService } from './image-upload.interface';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LocalImageUploadService implements IImageUploadService {
  private readonly uploadPath = './uploads';

  constructor() {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async save(file: Express.Multer.File): Promise<string> {
    const filename = `${uuidv4()}${path.extname(file.originalname)}`;
    const filePath = path.join(this.uploadPath, filename);
    await fs.promises.writeFile(filePath, file.buffer);
    return `/${this.uploadPath}/${filename}`;
  }

  async saveMany(files: Express.Multer.File[]): Promise<string[]> {
    const urls: string[] = [];
    for (const file of files) {
      urls.push(await this.save(file));
    }
    return urls;
  }
}
