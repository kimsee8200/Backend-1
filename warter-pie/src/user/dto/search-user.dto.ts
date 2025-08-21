import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '@prisma/client';

export class SearchUserDto {
  @ApiProperty({ description: '사용자 이름으로 검색', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: '사용자 타입으로 필터링', required: false, enum: UserType })
  @IsOptional()
  @IsEnum(UserType)
  userType?: UserType;

  @ApiProperty({ description: '페이지 번호', required: false, default: 1 })
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ description: '페이지당 항목 수', required: false, default: 10 })
  @IsOptional()
  limit?: number = 10;
}
