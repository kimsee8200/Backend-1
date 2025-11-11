import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ExperienceService } from '../service/experience.service';
import { PostReviewDto } from '../dto/post-review.dto';
import { ApplyExperienceDto } from '../dto/apply-experience.dto';
import { JwtAuthGuard } from '../../auth/passport/jwt/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  CurrentUser,
  CurrentUserPayload,
} from '../../user/decorators/current-user.decorator';
import { MyReviewItemDto } from '../dto/response/my-review-list.dto';
import { ExperienceListQueryDto } from '../../experience-manage/dto/experience-list.query.dto';

@ApiTags('experience')
@Controller('experience')
export class ExperienceController {
  constructor(private readonly service: ExperienceService) {}

  @ApiOperation({ summary: '체험단 목록/검색(선택 인증)' })
  @Get('list')
  async list(@Query() query: ExperienceListQueryDto) {
    return this.service.list(query);
  }

  @ApiOperation({ summary: '진행중 체험 조회(필수 인증)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async myProgress(@CurrentUser() user: CurrentUserPayload) {
    return this.service.myProgress(user.userId);
  }

  @ApiOperation({ summary: '지난 체험 조회(필수 인증)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me/before')
  async myPast(@CurrentUser() user: CurrentUserPayload) {
    return this.service.myPast(user.userId);
  }

  @ApiOperation({ summary: '내 리뷰 목록 조회(필수 인증)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: [MyReviewItemDto] })
  @Get('me/reviews')
  async myReviews(@CurrentUser() user: CurrentUserPayload) {
    return this.service.listMyReviews(user.userId);
  }

  @ApiOperation({ summary: '체험단 상세 조회(선택 인증)' })
  @Get(':id')
  async detail(@Param('id', ParseIntPipe) id: number) {
    return this.service.detail(id, null);
  }

  @ApiOperation({ summary: '체험 신청(필수 인증)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id')
  async apply(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id', ParseIntPipe) expId: number,
    @Body() applyDto: ApplyExperienceDto,
  ) {
    return {
      exp_id: await this.service.apply(expId, user.userId, applyDto.pitchText),
    };
  }

  @ApiOperation({ summary: '리뷰 등록(필수 인증)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/review')
  async postReview(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id', ParseIntPipe) expId: number,
    @Body() dto: PostReviewDto,
  ) {
    await this.service.postReview(expId, user.userId, dto);
    return {};
  }

  @ApiOperation({ summary: '리뷰 삭제(필수 인증)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id/:reviewId')
  @HttpCode(200)
  async deleteReview(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id', ParseIntPipe) expId: number,
    @Param('reviewId', ParseIntPipe) reviewId: number,
  ) {
    await this.service.deleteReview(expId, reviewId, user.userId);
    return {};
  }

  @ApiOperation({ summary: '체험 신청 취소(필수 인증)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(200)
  async cancelApplication(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id', ParseIntPipe) expId: number,
  ) {
    await this.service.cancelApplication(expId, user.userId);
    return {};
  }
}
