import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Query,
  ForbiddenException,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiParam, ApiExtraModels } from '@nestjs/swagger';
import { UserService } from '../service/user.service';
import { InfluencerSignupDto } from '../dto/signup/influencer-signup.dto';
import { BrandManagerSignupDto } from '../dto/signup/brand-manager-signup.dto';
import { MarketingAgencySignupDto } from '../dto/signup/marketing-agency-signup.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UpdateInfluencerDto } from '../dto/update-influencer.dto';
import { UpdateBrandManagerDto } from '../dto/update-brand-manager.dto';
import { UpdateMarketingAgencyDto } from '../dto/update-marketing-agency.dto';
import { SearchUserDto } from '../dto/search-user.dto';
import { JwtAuthGuard } from '../../auth/passport/jwt/jwt-auth.guard';
import { ChangePasswordDto } from '../dto/change-password.dto';
import {
  Op,
  Ok,
  Created,
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  RequireAuth,
  SearchQueries,
} from '../../common/decorators/swagger.decorators';
import { ApiSuccess } from '../../common/decorators/api-success';
import { SuccessResponseDto } from '../../common/dto/success-response.dto';
import { SearchUsersResponseDto } from '../dto/response/search-users-response.dto';
import { PaginationMetaDto } from '../dto/response/pagination-meta.dto';
import { ListUserResponseDto } from '../dto/response/list-user-response.dto';
import {
  CurrentUser,
  CurrentUserPayload,
} from '../decorators/current-user.decorator';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@ApiTags('users')
@ApiExtraModels(
  SuccessResponseDto,
  SearchUsersResponseDto,
  PaginationMetaDto,
  ListUserResponseDto,
)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Op('전체 사용자 조회', '모든 사용자 목록을 조회합니다.')
  @Ok('사용자 목록 조회 성공')
  @RequireAuth()
  @UseGuards(JwtAuthGuard)
  @ApiSuccess()
  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Op('사용자 검색', '이름과 사용자 타입으로 사용자를 검색합니다.')
  @Ok('사용자 검색 성공')
  @SearchQueries()
  @RequireAuth()
  @UseGuards(JwtAuthGuard)
  @ApiSuccess(SearchUsersResponseDto)
  @Get('search')
  async searchUsers(@Query() searchDto: SearchUserDto) {
    return this.userService.searchUsers(searchDto);
  }

  @Op('사용자 통계', '사용자 타입별 통계 정보를 조회합니다.')
  @Ok('사용자 통계 조회 성공')
  @RequireAuth()
  @UseGuards(JwtAuthGuard)
  @ApiSuccess()
  @Get('stats')
  async getUserStats() {
    return this.userService.getUserStats();
  }

  @Op(
    '현재 사용자 정보',
    'JWT 토큰으로 현재 로그인한 사용자 정보를 조회합니다.',
  )
  @Ok('현재 사용자 정보 조회 성공')
  @Unauthorized()
  @RequireAuth()
  @ApiSuccess(ListUserResponseDto)
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@CurrentUser() user: CurrentUserPayload) {
    return this.userService.getCurrentUserWithDetails(user.userId);
  }

  @Op('인플루언서 목록', '모든 인플루언서 목록을 조회합니다.')
  @Ok('인플루언서 목록 조회 성공')
  @RequireAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiSuccess()
  @Get('type/influencers')
  async findInfluencers() {
    return this.userService.findInfluencers();
  }

  @Op('브랜드 매니저 목록', '모든 브랜드 매니저 목록을 조회합니다.')
  @Ok('브랜드 매니저 목록 조회 성공')
  @RequireAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiSuccess()
  @Get('type/brand-managers')
  async findBrandManagers() {
    return this.userService.findBrandManagers();
  }

  @Op('마케팅 대행사 목록', '모든 마케팅 대행사 목록을 조회합니다.')
  @Ok('마케팅 대행사 목록 조회 성공')
  @RequireAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiSuccess()
  @Get('type/marketing-agencies')
  async findMarketingAgencies() {
    return this.userService.findMarketingAgencies();
  }

  @Op('인플루언서 회원가입', '인플루언서로 회원가입합니다.')
  @Created('인플루언서 회원가입 성공')
  @BadRequest()
  @ApiSuccess()
  @Post('signup/influencer')
  async createInfluencer(@Body() influencerSignupDto: InfluencerSignupDto) {
    return this.userService.createInfluencer(influencerSignupDto);
  }

  @Op('브랜드 매니저 회원가입', '브랜드 매니저로 회원가입합니다.')
  @Created('브랜드 매니저 회원가입 성공')
  @BadRequest()
  @ApiSuccess()
  @Post('signup/brand-manager')
  async createBrandManager(
    @Body() brandManagerSignupDto: BrandManagerSignupDto,
  ) {
    return this.userService.createBrandManager(brandManagerSignupDto);
  }

  @Op('마케팅 대행사 회원가입', '마케팅 대행사로 회원가입합니다.')
  @Created('마케팅 대행사 회원가입 성공')
  @BadRequest()
  @ApiSuccess()
  @Post('signup/marketing-agency')
  async createMarketingAgency(
    @Body() marketingAgencySignupDto: MarketingAgencySignupDto,
  ) {
    return this.userService.createMarketingAgency(marketingAgencySignupDto);
  }

  @Op('현재 사용자 정보 수정', 'JWT 토큰으로 현재 사용자 정보를 수정합니다.')
  @Ok('사용자 정보 수정 성공')
  @Unauthorized()
  @RequireAuth()
  @UseGuards(JwtAuthGuard)
  @ApiSuccess()
  @Put('me')
  async updateCurrentUser(
    @CurrentUser() user: CurrentUserPayload,
    @Body() data: UpdateUserDto,
  ) {
    return this.userService.update(user.userId, data);
  }

  @Op('인플루언서 프로필 수정', '현재 인플루언서의 프로필 정보를 수정합니다.')
  @Ok('프로필 수정 성공')
  @BadRequest('잘못된 요청 또는 권한 없음')
  @Unauthorized()
  @RequireAuth()
  @UseGuards(JwtAuthGuard)
  @ApiSuccess()
  @Put('me/influencer-profile')
  async updateInfluencerProfile(
    @CurrentUser() user: CurrentUserPayload,
    @Body() data: UpdateInfluencerDto,
  ) {
    return this.userService.updateInfluencerProfile(user.userId, data);
  }

  @Op(
    '브랜드 매니저 프로필 수정',
    '현재 브랜드 매니저의 프로필 정보를 수정합니다.',
  )
  @Ok('프로필 수정 성공')
  @BadRequest('잘못된 요청 또는 권한 없음')
  @Unauthorized()
  @RequireAuth()
  @UseGuards(JwtAuthGuard)
  @ApiSuccess()
  @Put('me/brand-manager-profile')
  async updateBrandManagerProfile(
    @CurrentUser() user: CurrentUserPayload,
    @Body() data: UpdateBrandManagerDto,
  ) {
    return this.userService.updateBrandManagerProfile(user.userId, data);
  }

  @Op(
    '마케팅 대행사 프로필 수정',
    '현재 마케팅 대행사의 프로필 정보를 수정합니다.',
  )
  @Ok('프로필 수정 성공')
  @BadRequest('잘못된 요청 또는 권한 없음')
  @Unauthorized()
  @RequireAuth()
  @UseGuards(JwtAuthGuard)
  @ApiSuccess()
  @Put('me/marketing-agency-profile')
  async updateMarketingAgencyProfile(
    @CurrentUser() user: CurrentUserPayload,
    @Body() data: UpdateMarketingAgencyDto,
  ) {
    return this.userService.updateMarketingAgencyProfile(user.userId, data);
  }

  @Op('비밀번호 변경', '현재 사용자의 비밀번호를 변경합니다.')
  @Ok('비밀번호 변경 성공')
  @BadRequest('잘못된 요청 또는 현재 비밀번호 불일치')
  @Unauthorized()
  @RequireAuth()
  @UseGuards(JwtAuthGuard)
  @ApiSuccess()
  @Put('me/change-password')
  async changePassword(
    @CurrentUser() user: CurrentUserPayload,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(user.userId, changePasswordDto);
  }

  @Op('현재 사용자 삭제', 'JWT 토큰으로 현재 사용자를 삭제합니다.')
  @Ok('사용자 삭제 성공')
  @Unauthorized()
  @RequireAuth()
  @UseGuards(JwtAuthGuard)
  @ApiSuccess()
  @Delete('me')
  async deleteCurrentUser(@CurrentUser() user: CurrentUserPayload) {
    return this.userService.delete(user.userId);
  }
}
