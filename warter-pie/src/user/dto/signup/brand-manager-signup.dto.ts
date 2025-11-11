import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { InfluencerSignupDto } from './influencer-signup.dto';

export class BrandManagerSignupDto extends InfluencerSignupDto {
  @IsString()
  businessRegistrationNumber: string;

  @IsString()
  address: string;

  @IsString()
  detailedAddress: string;
}
