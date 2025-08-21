import { IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateInfluencerDto {
  @ApiProperty({ description: '유튜브 URL', required: false })
  @IsOptional()
  @IsString()
  @IsUrl()
  youtubeUrl?: string;

  @ApiProperty({ description: '블로그 URL', required: false })
  @IsOptional()
  @IsString()
  @IsUrl()
  blogUrl?: string;

  @ApiProperty({ description: '인스타그램 URL', required: false })
  @IsOptional()
  @IsString()
  @IsUrl()
  instagramUrl?: string;

  @ApiProperty({ description: '틱톡 URL', required: false })
  @IsOptional()
  @IsString()
  @IsUrl()
  tiktokUrl?: string;
}
