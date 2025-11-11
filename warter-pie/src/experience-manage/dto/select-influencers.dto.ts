import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayNotEmpty, IsEmail } from 'class-validator';

export class SelectInfluencersDto {
  @ApiProperty({
    description: '선정할 인플루언서의 이메일 주소 배열',
    example: ['influencer1@example.com', 'influencer2@example.com'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsEmail({}, { each: true })
  selected_members: string[];
}
