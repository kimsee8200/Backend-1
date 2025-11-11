import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class ExperienceListQueryDto {
  @ApiPropertyOptional({ description: '검색어(제목/회사명)', example: '여름' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({
    description: '채널 필터',
    type: [Number],
    example: [1, 2],
  })
  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map(Number) : [Number(value)],
  )
  @IsArray()
  channels?: number[];

  @ApiPropertyOptional({
    description: '제공 형태(1=방문형/2=포장형/3=배송형/4=구매형)',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  productOfferType?: number;
}
