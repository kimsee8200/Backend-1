import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InfluencerSignupDto } from '../dto/influencer-signup.dto';
import { BrandManagerSignupDto } from '../dto/brand-manager-signup.dto';
import { MarketingAgencySignupDto } from '../dto/marketing-agency-signup.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ListInfluencerResponseDto } from '../dto/list-influencer-response.dto';
import { ListBrandManagerResponseDto } from '../dto/list-brand-manager-response.dto';
import { ListMarketingAgencyResponseDto } from '../dto/list-marketing-agency-response.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        influencer: true,
        brandManager: true,
        marketingAgency: true,
      },
    });
  }

  async createInfluencer(dto: InfluencerSignupDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    
    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        phoneNumber: dto.phoneNumber,
        userType: UserType.INFLUENCER,
        influencer: {
          create: {
            youtubeUrl: dto.youtubeUrl,
            blogUrl: dto.blogUrl,
            instagramUrl: dto.instagramUrl,
            tiktokUrl: dto.tiktokUrl,
          },
        },
      },
      include: {
        influencer: true,
      },
    });
  }

  async createBrandManager(dto: BrandManagerSignupDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    
    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        phoneNumber: dto.phoneNumber,
        userType: UserType.BRAND_MANAGER,
        brandManager: {
          create: {
            youtubeUrl: dto.youtubeUrl,
            blogUrl: dto.blogUrl,
            instagramUrl: dto.instagramUrl,
            tiktokUrl: dto.tiktokUrl,
            businessRegistrationNumber: dto.businessRegistrationNumber,
            address: dto.address,
            detailedAddress: dto.detailedAddress,
          },
        },
      },
      include: {
        brandManager: true,
      },
    });
  }

  async createMarketingAgency(dto: MarketingAgencySignupDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    
    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        phoneNumber: dto.phoneNumber,
        userType: UserType.MARKETING_AGENCY,
        marketingAgency: {
          create: {
            businessRegistrationNumber: dto.businessRegistrationNumber,
            address: dto.address,
            detailedAddress: dto.detailedAddress,
          },
        },
      },
      include: {
        marketingAgency: true,
      },
    });
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        name: createUserDto.name || '',
        userType: UserType.INFLUENCER, // 기본값으로 INFLUENCER 타입 설정
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        influencer: true,
        brandManager: true,
        marketingAgency: true,
      },
    });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        influencer: true,
        brandManager: true,
        marketingAgency: true,
      },
    });
  }

  async getCurrentUserWithDetails(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        influencer: true,
        brandManager: true,
        marketingAgency: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // 비밀번호 제거
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(id: number, data: any) {
    return this.prisma.user.update({
      where: { id },
      data,
      include: {
        influencer: true,
        brandManager: true,
        marketingAgency: true,
      },
    });
  }

  async delete(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  // 특정 타입의 사용자만 조회하는 메서드들
  async findInfluencers() {
    return ListInfluencerResponseDto.fromEntities(await this.prisma.user.findMany({
      where: { userType: UserType.INFLUENCER },
      include: { influencer: true },
    }));
  }

  async findBrandManagers() {
    return ListBrandManagerResponseDto.fromEntities(await this.prisma.user.findMany({
      where: { userType: UserType.BRAND_MANAGER },
      include: { brandManager: true },
    }));
  }

  async findMarketingAgencies() {
    return ListMarketingAgencyResponseDto.fromEntities(await this.prisma.user.findMany({
      where: { userType: UserType.MARKETING_AGENCY },
      include: { marketingAgency: true },
    }));
  }
}
