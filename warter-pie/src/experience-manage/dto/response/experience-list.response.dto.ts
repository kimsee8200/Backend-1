import { ApiProperty } from '@nestjs/swagger';

export class ExperienceListItemDto {
  @ApiProperty() id: number;
  @ApiProperty() title: string;
  @ApiProperty() companyName: string | null;
  @ApiProperty() productOfferType: number | null;
  @ApiProperty() headcount: number;
  @ApiProperty() applyStartAt: Date;
  @ApiProperty() applyEndAt: Date;
  @ApiProperty() memberAnnouncementDate: Date | null;
  @ApiProperty() presidentImage: string | null;
}

export class ExperienceListResponseDto {
  @ApiProperty({ type: [ExperienceListItemDto] })
  items: ExperienceListItemDto[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total: number;
}
