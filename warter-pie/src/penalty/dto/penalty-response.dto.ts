import { ApiProperty } from '@nestjs/swagger';

export class PenaltyResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  reason: string;

  @ApiProperty()
  appliedAt: Date;
}
