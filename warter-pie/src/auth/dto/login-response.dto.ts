import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;

  @ApiProperty({
    example: {
      id: 1,
      email: 'user@example.com',
      userType: 'INFLUENCER',
      name: '홍길동',
    },
  })
  user: {
    id: number;
    email: string;
    userType: string;
    name: string;
  };
}
