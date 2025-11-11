import { ApiProperty } from '@nestjs/swagger';

export class PenaltyCountDto {
  @ApiProperty({ description: 'Total number of penalties for the user' })
  count: number;
}
