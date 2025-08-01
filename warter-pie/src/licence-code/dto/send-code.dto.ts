import { IsEmail, IsNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class SendCodeDto {
    @ApiProperty({
        description: '이메일 주소',
        example: 'user@example.com',
        type: String
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: '인증 코드',
        example: 'ABC123DEF456',
        type: String
    })
    @IsNotEmpty()
    code: string;
}
