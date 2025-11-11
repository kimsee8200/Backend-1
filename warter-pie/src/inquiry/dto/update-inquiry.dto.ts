import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateInquiryDto {
  @ApiProperty({ description: 'Inquiry title', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'Inquiry content', required: false })
  @IsString()
  @IsOptional()
  content?: string;
}
