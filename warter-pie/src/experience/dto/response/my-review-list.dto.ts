import { ApiProperty } from '@nestjs/swagger';

export class MyReviewItemDto {
  @ApiProperty({ description: '캠페인 ID' })
  campaignId: number;

  @ApiProperty({ description: '캠페인 제목' })
  campaignTitle: string;

  @ApiProperty({ description: '리뷰 ID (제출물 ID)' })
  reviewId: number;

  @ApiProperty({ description: '리뷰 메시지', required: false })
  reviewMessage?: string;

  @ApiProperty({ description: '리뷰 URL 목록', type: [String] })
  reviewUrls: string[];

  @ApiProperty({ description: '리뷰 제출일' })
  submittedAt: Date;
}
