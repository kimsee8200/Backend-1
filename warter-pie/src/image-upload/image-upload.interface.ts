export interface IImageUploadService {
  save(file: Express.Multer.File): Promise<string>;
  saveMany(files: Express.Multer.File[]): Promise<string[]>;
}
