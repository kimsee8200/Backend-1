import { IsString, IsEmail, MinLength } from 'class-validator';
import e from 'express';
import { CreateUserDto } from './create-user.dto';

export class MarketingAgencySignupDto extends CreateUserDto{

  @IsString()
  businessRegistrationNumber: string;

  @IsString()
  address: string;

  @IsString()
  detailedAddress: string;
} 