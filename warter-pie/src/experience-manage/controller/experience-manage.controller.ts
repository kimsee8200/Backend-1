import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Request,
  Param,
  ParseIntPipe,
  Put,
  Delete,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/passport/jwt/jwt-auth.guard';
import { ExperienceManageService } from '../service/experience-manage.service';
import { ExperienceInsertDataDto } from '../dto/experience-insert-data.dto';
import { ExperienceUpdateDataDto } from '../dto/experience-update-data.dto';
import { ApiSuccess } from '../../common/decorators/api-success';
import { SuccessResponseDto } from '../../common/dto/success-response.dto';
import { ExperienceListQueryDto } from '../dto/experience-list.query.dto';
import { ExperienceListResponseDto } from '../dto/response/experience-list.response.dto';
import { ApplicationStatus, CampaignStatus } from '@prisma/client';
import {
  CurrentUser,
  CurrentUserPayload,
} from '../../user/decorators/current-user.decorator';
import { CampaignReviewItemDto } from '../dto/response/campaign-review-list.response.dto';
import { ApplicationListItemDto } from '../dto/response/application-list-item.dto';
import { SelectInfluencersDto } from '../dto/select-influencers.dto';

@ApiTags('experience-manage')
@ApiExtraModels(
  SuccessResponseDto,
  ExperienceListResponseDto,
  CampaignReviewItemDto,
  ApplicationListItemDto,
)
@Controller('experience-manage')
export class ExperienceManageController {
  constructor(private readonly service: ExperienceManageService) {}

  @ApiOperation({
    summary: '체험단 등록',
    description:
      '명세에 맞춘 multipart/form-data 업로드로 체험단을 등록합니다.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        data: { type: 'string', description: '명세의 JSON 문자열' },
        president_image: { type: 'string', format: 'binary' },
        images: { type: 'array', items: { type: 'string', format: 'binary' } },
      },
      required: ['data'],
    },
  })
  @ApiResponse({ status: 201, description: '등록 성공' })
  @ApiSuccess()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  @Post('insert')
  async insert(
    @CurrentUser() user: CurrentUserPayload,
    @UploadedFiles() files: Express.Multer.File[],
    @Body('data') data: string,
  ) {
    const fileMap: Record<string, any[]> = {};
    for (const f of files || []) {
      const field = f.fieldname || 'images';
      fileMap[field] = fileMap[field] || [];
      fileMap[field].push(f);
    }
    const parsed: ExperienceInsertDataDto = JSON.parse(data);
    return this.service.insertExperience(user.userId, parsed, {
      president_image: fileMap['president_image']?.[0] || null,
      images: fileMap['images'] || [],
    });
  }

  @ApiOperation({
    summary: '체험단 목록 조회',
    description: '명세 응답 형식대로 배열을 반환합니다.',
  })
  @ApiResponse({ status: 200, description: '목록 조회 성공' })
  @ApiSuccess()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('list')
  async list(
    @CurrentUser() user: CurrentUserPayload,
    @Query() query: ExperienceListQueryDto,
  ) {
    return this.service.listExperiences(user.userId, query);
  }

  @ApiOperation({
    summary: '체험단 수정',
    description: '명세의 data(JSON)과 파일을 이용해 체험단을 수정합니다.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'string',
          description: '명세의 JSON 문자열(부분 필드만 포함 가능)',
        },
        president_image: { type: 'string', format: 'binary' },
        images: { type: 'array', items: { type: 'string', format: 'binary' } },
      },
      required: ['data'],
    },
  })
  @ApiSuccess()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  @Put('/:id')
  async update(
    @CurrentUser() user: CurrentUserPayload,
    @UploadedFiles() files: Express.Multer.File[],
    @Body('data') data: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const fileMap: Record<string, any[]> = {};
    for (const f of files || []) {
      const field = f.fieldname || 'images';
      fileMap[field] = fileMap[field] || [];
      fileMap[field].push(f);
    }
    const parsed: ExperienceUpdateDataDto = JSON.parse(data);
    return this.service.updateExperience(user.userId, id, parsed, {
      president_image: fileMap['president_image']?.[0] || null,
      images: fileMap['images'] || [],
    });
  }

  @ApiOperation({ summary: '체험단 삭제', description: '체험단을 삭제합니다.' })
  @ApiSuccess()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async delete(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.deleteExperience(user.userId, id);
  }

  // 테스트 필요
  @ApiOperation({
    summary: '체험단 인플루언서 선정',
    description:
      '인플루언서 이메일 목록을 받아 체험단으로 선정(합격) 처리합니다.',
  })
  @ApiSuccess()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/:id/select')
  async select(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: SelectInfluencersDto,
  ) {
    return this.service.selectInfluencers(
      user.userId,
      id,
      body.selected_members,
    );
  }

  @ApiOperation({
    summary: '체험단 상세 조회',
    description: '체험단 상세 정보를 반환합니다.',
  })
  @ApiSuccess()
  @Get('detail/:id')
  async detail(@Param('id', ParseIntPipe) id: number) {
    return this.service.getExperienceDetail(id);
  }

  @ApiOperation({
    summary: '체험단 신청 목록',
    description: '특정 체험단의 신청 내역을 조회합니다.',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ApplicationStatus,
    description: '신청 상태(PENDING, APPROVED, REJECTED, CANCELLED)로 필터링',
  })
  @ApiSuccess(ApplicationListItemDto)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id/applications')
  async applications(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id', ParseIntPipe) id: number,
    @Query('status') status?: ApplicationStatus,
  ) {
    return this.service.listApplications(user.userId, id, status as any);
  }

  @ApiOperation({
    summary: '캠페인 리뷰 목록 조회',
    description: '특정 캠페인에 등록된 리뷰 목록을 조회합니다.',
  })
  @ApiResponse({
    type: [CampaignReviewItemDto],
    description: '리뷰 목록 조회 성공',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id/reviews')
  async listReviews(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id', ParseIntPipe) campaignId: number,
  ) {
    return this.service.listCampaignReviews(user.userId, campaignId);
  }

  @ApiOperation({
    summary: '제출된 리뷰 심사',
    description:
      '신청에 연결된 최근 리뷰를 승인/거절하고, 승인 시 리워드를 지급합니다.',
  })
  @ApiSuccess()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('applications/:applicationId/review/:decision')
  async review(
    @CurrentUser() user: CurrentUserPayload,
    @Param('applicationId', ParseIntPipe) applicationId: number,
    @Param('decision') decision: 'approve' | 'reject',
  ) {
    return this.service.reviewApplication(user.userId, applicationId, decision);
  }

  @ApiOperation({
    summary: '체험단 신청 취소',
    description: '신청을 취소합니다.',
  })
  @ApiSuccess()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('applications/:applicationId/cancel')
  async cancel(
    @CurrentUser() user: CurrentUserPayload,
    @Param('applicationId', ParseIntPipe) applicationId: number,
  ) {
    return this.service.cancelApplication(user.userId, applicationId);
  }

  @ApiOperation({
    summary: '체험단 상태 변경',
    description: '캠페인 상태를 변경합니다.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: Object.values(CampaignStatus) },
      },
      required: ['status'],
    },
  })
  @ApiSuccess()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/status')
  async updateStatus(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: CampaignStatus,
  ) {
    return this.service.updateStatus(user.userId, id, status);
  }
}
