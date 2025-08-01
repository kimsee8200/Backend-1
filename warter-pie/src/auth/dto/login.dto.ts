import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: '사용자 이메일',
    example: 'user@example.com',
    type: String
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '사용자 비밀번호',
    example: 'password123',
    type: String,
    minLength: 8
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
