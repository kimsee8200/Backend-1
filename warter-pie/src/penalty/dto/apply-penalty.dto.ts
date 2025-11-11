import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApplyPenaltyDto {
  @ApiProperty({ description: 'ID of the user to apply penalty to' })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ description: 'Reason for the penalty' })
  @IsString()
  @IsNotEmpty()
  reason: string;
}
