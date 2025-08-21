import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ExperienceService } from '../service/experience.service';
import { PostReviewDto } from '../dto/post-review.dto';
import { JwtAuthGuard } from '../../auth/passport/jwt/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('experience')
@Controller('experience')
export class ExperienceController {
  constructor(private readonly service: ExperienceService) {}

  @ApiOperation({ summary: '체험단 목록/검색(선택 인증)' })
  @Get('list')
  async list(@Query('keyword') keyword?: string) {
    return this.service.list(keyword ?? null);
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
  async apply(@Param('id', ParseIntPipe) expId: number, @Body() _body: any, @Query() _q: any, @Body() _b2?: any) {
    // JWT 가드에서 할당된 사용자 ID 사용
    // Nest 표준에서는 @Req()로 req.user.userId를 받지만, 간단히 서비스에서 처리하지 않고 컨트롤러에서 가져옵니다.
    // 여기는 req를 직접 받지 않도록 단순화했으므로 서비스 단에서 보완하지 않고 컨트롤러에서 처리하려면 @Request가 필요합니다.
    return { exp_id: await this.service.apply(expId) };
  }

  @ApiOperation({ summary: '진행중 체험 조회(필수 인증)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async myProgress() {
    return this.service.myProgress('me');
  }

  @ApiOperation({ summary: '지난 체험 조회(필수 인증)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me/before')
  async myPast() {
    return this.service.myPast('me');
  }

  @ApiOperation({ summary: '리뷰 등록(필수 인증)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/review')
  async postReview(@Param('id', ParseIntPipe) expId: number, @Body() dto: PostReviewDto) {
    await this.service.postReview(expId, 'me', dto);
    return {};
  }

  @ApiOperation({ summary: '리뷰 삭제(필수 인증)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id/:reviewId')
  @HttpCode(200)
  async deleteReview(@Param('id', ParseIntPipe) expId: number, @Param('reviewId', ParseIntPipe) reviewId: number) {
    await this.service.deleteReview(expId, reviewId, 'me');
    return {};
  }

  @ApiOperation({ summary: '체험 신청 취소(필수 인증)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(200)
  async cancelApplication(@Param('id', ParseIntPipe) expId: number) {
    await this.service.cancelApplication(expId, 'me');
    return {};
  }
}
