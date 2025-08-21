import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMarketingAgencyDto {
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
