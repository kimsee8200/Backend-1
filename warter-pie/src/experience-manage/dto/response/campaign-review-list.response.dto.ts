import { ApiProperty } from '@nestjs/swagger';
import { SubmissionStatus } from '@prisma/client';

export class CampaignReviewItemDto {
  @ApiProperty({ description: '신청 ID' })
  applicationId: number;

  @ApiProperty({ description: '인플루언서 ID' })
  influencerId: number;

  @ApiProperty({ description: '인플루언서 이름' })
  influencerName: string;

  @ApiProperty({ description: '리뷰 제출 상태', enum: SubmissionStatus })
  submissionStatus: SubmissionStatus;

  @ApiProperty({ description: '리뷰 메시지', required: false })
  reviewMessage?: string;

  @ApiProperty({ description: '리뷰 URL 목록', type: [String] })
  reviewUrls: string[];

  @ApiProperty({ description: '리뷰 제출일', required: false })
  submittedAt?: Date;
}
