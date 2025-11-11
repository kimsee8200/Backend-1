import { ApiProperty } from '@nestjs/swagger';
import { InquiryStatus } from '@prisma/client';

export class InquiryResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty({ required: false, nullable: true })
  answer: string | null;

  @ApiProperty({ enum: ['PENDING', 'ANSWERED'] })
  status: InquiryStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  authorId: number;
}
