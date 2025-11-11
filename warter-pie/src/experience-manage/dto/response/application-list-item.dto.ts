import { ApiProperty } from '@nestjs/swagger';
import { ApplicationStatus } from '@prisma/client';

export class ApplicationListItemDto {
  @ApiProperty()
  application_id: number;

  @ApiProperty()
  influencer_id: number;

  @ApiProperty()
  influencer_name: string;

  @ApiProperty({ description: "Influencer's email address" })
  influencer_email: string;

  @ApiProperty({ enum: ApplicationStatus })
  status: ApplicationStatus;

  @ApiProperty({ nullable: true })
  pitch_text: string | null;

  @ApiProperty()
  created_at: Date;

  @ApiProperty({ description: 'Number of penalties for the influencer' })
  penalty_count: number; // New field

  @ApiProperty({
    nullable: true,
    description: "Influencer's YouTube channel URL",
  })
  youtube_url: string | null;

  @ApiProperty({ nullable: true, description: "Influencer's Blog URL" })
  blog_url: string | null;

  @ApiProperty({
    nullable: true,
    description: "Influencer's Instagram profile URL",
  })
  instagram_url: string | null;

  @ApiProperty({
    nullable: true,
    description: "Influencer's TikTok profile URL",
  })
  tiktok_url: string | null;
}
