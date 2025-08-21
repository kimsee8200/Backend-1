import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InfluencerSignupDto } from '../dto/signup/influencer-signup.dto';
import { BrandManagerSignupDto } from '../dto/signup/brand-manager-signup.dto';
import { MarketingAgencySignupDto } from '../dto/signup/marketing-agency-signup.dto';
import { CreateUserDto } from '../dto/signup/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UpdateInfluencerDto } from '../dto/update-influencer.dto';
import { UpdateBrandManagerDto } from '../dto/update-brand-manager.dto';
import { UpdateMarketingAgencyDto } from '../dto/update-marketing-agency.dto';
import { SearchUserDto } from '../dto/search-user.dto';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ListInfluencerResponseDto } from '../dto/response/list-influencer-response.dto';
import { ListBrandManagerResponseDto } from '../dto/response/list-brand-manager-response.dto';
import { ListMarketingAgencyResponseDto } from '../dto/response/list-marketing-agency-response.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';

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
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        influencer: true,
        brandManager: true,
        marketingAgency: true,
      },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return user;
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
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 비밀번호 제거
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(id: number, data: UpdateUserDto) {
    const updateData: any = {};
    
    // 기본 사용자 정보 업데이트
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phoneNumber !== undefined) updateData.phoneNumber = data.phoneNumber;
    
    // 비밀번호 변경
    if (data.newPassword) {
      updateData.password = await bcrypt.hash(data.newPassword, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        influencer: true,
        brandManager: true,
        marketingAgency: true,
      },
    });
  }

  async updateInfluencerProfile(userId: number, data: UpdateInfluencerDto) {
    const user = await this.findById(userId);
    
    if (user.userType !== UserType.INFLUENCER) {
      throw new BadRequestException('인플루언서만 프로필을 수정할 수 있습니다.');
    }

    return this.prisma.influencer.update({
      where: { userId },
      data,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phoneNumber: true,
            userType: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  async updateBrandManagerProfile(userId: number, data: UpdateBrandManagerDto) {
    const user = await this.findById(userId);
    
    if (user.userType !== UserType.BRAND_MANAGER) {
      throw new BadRequestException('브랜드 매니저만 프로필을 수정할 수 있습니다.');
    }

    return this.prisma.brandManager.update({
      where: { userId },
      data,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phoneNumber: true,
            userType: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  async updateMarketingAgencyProfile(userId: number, data: UpdateMarketingAgencyDto) {
    const user = await this.findById(userId);
    
    if (user.userType !== UserType.MARKETING_AGENCY) {
      throw new BadRequestException('마케팅 대행사만 프로필을 수정할 수 있습니다.');
    }

    return this.prisma.marketingAgency.update({
      where: { userId },
      data,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phoneNumber: true,
            userType: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  async delete(id: number) {
    const user = await this.findById(id);
    
    return this.prisma.user.delete({
      where: { id },
    });
  }

  // 사용자 검색 기능
  async searchUsers(searchDto: SearchUserDto) {
    const { name, userType, page = 1, limit = 10 } = searchDto;
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive', // 대소문자 구분 없이 검색
      };
    }
    
    if (userType) {
      where.userType = userType;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: {
          influencer: true,
          brandManager: true,
          marketingAgency: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
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

  // 사용자 통계 정보
  async getUserStats() {
    const [totalUsers, influencerCount, brandManagerCount, marketingAgencyCount] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { userType: UserType.INFLUENCER } }),
      this.prisma.user.count({ where: { userType: UserType.BRAND_MANAGER } }),
      this.prisma.user.count({ where: { userType: UserType.MARKETING_AGENCY } }),
    ]);

    return {
      totalUsers,
      influencerCount,
      brandManagerCount,
      marketingAgencyCount,
    };
  }

  // 비밀번호 변경
  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const user = await this.findById(userId);
    
    // 현재 비밀번호 확인
    const isCurrentPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new BadRequestException('현재 비밀번호가 올바르지 않습니다.');
    }

    // 새 비밀번호 해시화
    const hashedNewPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

    // 비밀번호 업데이트
    return this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
      select: {
        id: true,
        email: true,
        name: true,
        userType: true,
        updatedAt: true,
      },
    });
  }
}
