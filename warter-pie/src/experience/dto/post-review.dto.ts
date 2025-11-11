import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayNotEmpty, IsString, IsNotEmpty } from 'class-validator';

export class PostReviewDto {
  @ApiProperty({
    description: '리뷰 링크',
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  urls: string[];

  @ApiProperty({
    description: '리뷰 내용 설명',
    example: '이 제품 정말 좋네요! 강력 추천합니다.',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
