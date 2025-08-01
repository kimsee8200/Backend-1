import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { UserService } from '../service/user.service';
import { InfluencerSignupDto } from '../dto/influencer-signup.dto';
import { BrandManagerSignupDto } from '../dto/brand-manager-signup.dto';
import { MarketingAgencySignupDto } from '../dto/marketing-agency-signup.dto';
import { JwtAuthGuard } from '../../auth/passport/jwt/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '전체 사용자 조회', description: '모든 사용자 목록을 조회합니다.' })
  @ApiResponse({ status: 200, description: '사용자 목록 조회 성공' })
  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: '현재 사용자 정보', description: 'JWT 토큰으로 현재 로그인한 사용자 정보를 조회합니다.' })
  @ApiResponse({ status: 200, description: '현재 사용자 정보 조회 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiBearerAuth()
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Request() req) {
    const userId = req.user.userId;
    return this.userService.getCurrentUserWithDetails(userId);
  }

  
  @ApiOperation({ summary: '인플루언서 목록', description: '모든 인플루언서 목록을 조회합니다.' })
  @ApiResponse({ status: 200, description: '인플루언서 목록 조회 성공' })
  @Get('type/influencers')
  async findInfluencers() {
    return this.userService.findInfluencers();
  }

  @ApiOperation({ summary: '브랜드 매니저 목록', description: '모든 브랜드 매니저 목록을 조회합니다.' })
  @ApiResponse({ status: 200, description: '브랜드 매니저 목록 조회 성공' })
  @Get('type/brand-managers')
  async findBrandManagers() {
    return this.userService.findBrandManagers();
  }

  @ApiOperation({ summary: '마케팅 대행사 목록', description: '모든 마케팅 대행사 목록을 조회합니다.' })
  @ApiResponse({ status: 200, description: '마케팅 대행사 목록 조회 성공' })
  @Get('type/marketing-agencies')
  async findMarketingAgencies() {
    return this.userService.findMarketingAgencies();
  }

  @ApiOperation({ summary: '인플루언서 회원가입', description: '인플루언서로 회원가입합니다.' })
  @ApiResponse({ status: 201, description: '인플루언서 회원가입 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터' })
  @Post('signup/influencer')
  async createInfluencer(@Body() influencerSignupDto: InfluencerSignupDto) {
    return this.userService.createInfluencer(influencerSignupDto);
  }

  @ApiOperation({ summary: '브랜드 매니저 회원가입', description: '브랜드 매니저로 회원가입합니다.' })
  @ApiResponse({ status: 201, description: '브랜드 매니저 회원가입 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터' })
  @Post('signup/brand-manager')
  async createBrandManager(@Body() brandManagerSignupDto: BrandManagerSignupDto) {
    return this.userService.createBrandManager(brandManagerSignupDto);
  }

  @ApiOperation({ summary: '마케팅 대행사 회원가입', description: '마케팅 대행사로 회원가입합니다.' })
  @ApiResponse({ status: 201, description: '마케팅 대행사 회원가입 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터' })
  @Post('signup/marketing-agency')
  async createMarketingAgency(@Body() marketingAgencySignupDto: MarketingAgencySignupDto) {
    return this.userService.createMarketingAgency(marketingAgencySignupDto);
  }

  @ApiOperation({ summary: '현재 사용자 정보 수정', description: 'JWT 토큰으로 현재 사용자 정보를 수정합니다.' })
  @ApiResponse({ status: 200, description: '사용자 정보 수정 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateCurrentUser(@Request() req, @Body() data: any) {
    const userId = req.user.userId;
    return this.userService.update(userId, data);
  }

  
  @ApiOperation({ summary: '현재 사용자 삭제', description: 'JWT 토큰으로 현재 사용자를 삭제합니다.' })
  @ApiResponse({ status: 200, description: '사용자 삭제 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteCurrentUser(@Request() req) {
    const userId = req.user.userId;
    return this.userService.delete(userId);
  }

} 