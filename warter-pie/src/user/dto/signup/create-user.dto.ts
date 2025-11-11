import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^01[0-9]-\d{3,4}-\d{4}$/, {
    message:
      'phoneNumber must be a valid Korean phone number (e.g., 010-1234-5678)',
  })
  phoneNumber: string;
}
