import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class InfluencerSignupDto extends CreateUserDto {
  @IsOptional()
  @IsString()
  youtubeUrl?: string;

  @IsOptional()
  @IsString()
  blogUrl?: string;

  @IsOptional()
  @IsString()
  instagramUrl?: string;

  @IsOptional()
  @IsString()
  tiktokUrl?: string;
}
