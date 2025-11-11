import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInquiryDto {
  @ApiProperty({ description: 'Inquiry title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Inquiry content' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
