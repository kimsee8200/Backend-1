import { IsArray, ArrayNotEmpty, IsString, IsNotEmpty } from 'class-validator';

export class PostReviewDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  urls: string[];

  @IsString()
  @IsNotEmpty()
  message: string;
}
