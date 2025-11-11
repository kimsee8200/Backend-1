import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AnswerInquiryDto {
  @ApiProperty({ description: 'Answer for the inquiry' })
  @IsString()
  @IsNotEmpty()
  answer: string;
}
