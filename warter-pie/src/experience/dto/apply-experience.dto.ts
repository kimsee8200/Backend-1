import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ApplyExperienceDto {
  @ApiProperty({
    description: '신청 시 남기는 한마디 (선택)',
    required: false,
    example: '캠페인에 꼭 참여하고 싶습니다! 잘 부탁드립니다.',
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  pitchText?: string;
}
