import {
  IsOptional,
  IsString,
  IsEmail,
  MinLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: '사용자 이름', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: '사용자 이메일', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: '사용자 전화번호', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^01[0-9]-\d{3,4}-\d{4}$/, {
    message:
      'phoneNumber must be a valid Korean phone number (e.g., 010-1234-5678)',
  })
  phoneNumber?: string;

  @ApiProperty({ description: '새 비밀번호', required: false })
  @IsOptional()
  @IsString()
  @MinLength(8)
  newPassword?: string;
}
