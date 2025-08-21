import { IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBrandManagerDto {
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

  @ApiProperty({ description: '사업자등록번호', required: false })
  @IsOptional()
  @IsString()
  businessRegistrationNumber?: string;

  @ApiProperty({ description: '주소', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: '상세주소', required: false })
  @IsOptional()
  @IsString()
  detailedAddress?: string;
}
