import { Body, Controller, Get, Post, Query, UploadedFiles, UseGuards, UseInterceptors, Request, Param, ParseIntPipe, Put } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiBody, ApiConsumes, ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/passport/jwt/jwt-auth.guard';
import { ExperienceManageService } from '../service/experience-manage.service';
import { ExperienceInsertDataDto } from '../dto/experience-insert-data.dto';
import { ExperienceUpdateDataDto } from '../dto/experience-update-data.dto';
import { ApiSuccess } from '../../common/decorators/api-success';
import { SuccessResponseDto } from '../../common/dto/success-response.dto';
import { ExperienceListQueryDto } from '../dto/experience-list.query.dto';
import { ExperienceListResponseDto } from '../dto/response/experience-list.response.dto';
import { ApplicationStatus, CampaignStatus } from '@prisma/client';

function filenameEdit(req: any, file: any, callback: (error: Error | null, filename: string) => void) {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  callback(null, uniqueSuffix + extname(file.originalname));
}

@ApiTags('experience-manage')
@ApiExtraModels(SuccessResponseDto, ExperienceListResponseDto)
@Controller('experience-manage')
export class ExperienceManageController {
  constructor(private readonly service: ExperienceManageService) {}

  @ApiOperation({ summary: '체험단 등록', description: '명세에 맞춘 multipart/form-data 업로드로 체험단을 등록합니다.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        data: { type: 'string', description: '명세의 JSON 문자열' },
        president_image: { type: 'string', format: 'binary' },
        images: { type: 'array', items: { type: 'string', format: 'binary' } },
      },
      required: ['data']
    }
  })
  @ApiResponse({ status: 201, description: '등록 성공' })
  @ApiSuccess()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor({
    storage: diskStorage({
      destination: './uploads',
      filename: filenameEdit,
    }),
  }))
  @Post('insert')
  async insert(@Request() req, @UploadedFiles() files: any[], @Body('data') data: string) {
    const fileMap: Record<string, any[]> = {};
    for (const f of files || []) {
      const field = (f as any).fieldname || 'images';
      fileMap[field] = fileMap[field] || [];
      fileMap[field].push(f);
    }
    const parsed: ExperienceInsertDataDto = JSON.parse(data);
    return this.service.insertExperience(req.user.userId, parsed, {
      president_image: (fileMap['president_image']?.[0]) || null,
      images: fileMap['images'] || [],
    });
  }

  @ApiOperation({ summary: '체험단 목록 조회', description: '명세 응답 형식대로 배열을 반환합니다.' })
  @ApiResponse({ status: 200, description: '목록 조회 성공' })
  @ApiSuccess()
  @Get('list')
  async list(@Query() query: ExperienceListQueryDto) {
    return this.service.listExperiences(query);
  }

  @ApiOperation({ summary: '체험단 수정', description: '명세의 data(JSON)과 파일을 이용해 체험단을 수정합니다.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        data: { type: 'string', description: '명세의 JSON 문자열(부분 필드만 포함 가능)' },
        president_image: { type: 'string', format: 'binary' },
        images: { type: 'array', items: { type: 'string', format: 'binary' } },
      },
      required: ['data']
    }
  })
  @ApiSuccess()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor({
    storage: diskStorage({
      destination: './uploads',
      filename: filenameEdit,
    }),
  }))
  @Put('/:id')
  async update(@Request() req, @UploadedFiles() files: any[], @Body('data') data: string, @Param('id', ParseIntPipe) id: number) {
    const fileMap: Record<string, any[]> = {};
    for (const f of files || []) {
      const field = (f as any).fieldname || 'images';
      fileMap[field] = fileMap[field] || [];
      fileMap[field].push(f);
    }
    const parsed: ExperienceUpdateDataDto = JSON.parse(data);
    return this.service.updateExperience(req.user.userId, id, parsed, {
      president_image: (fileMap['president_image']?.[0]) || null,
      images: fileMap['images'] || [],
    });
  }

  @ApiOperation({ summary: '체험단 삭제', description: '체험단을 삭제합니다.' })
  @ApiSuccess()
  @UseGuards(JwtAuthGuard)
  @Post('/:id')
  async delete(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.service.deleteExperience(req.user.userId, id);
  }

  @ApiOperation({ summary: '체험단 선정', description: '신청(application) ID 목록을 합격 처리합니다.' })
  @ApiBody({ schema: { type: 'object', properties: { applicationIds: { type: 'array', items: { type: 'number' } } }, required: ['applicationIds'] } })
  @ApiSuccess()
  @UseGuards(JwtAuthGuard)
  @Post('/:id/select')
  async select(@Request() req, @Param('id', ParseIntPipe) id: number, @Body('applicationIds') applicationIds: number[]) {
    return this.service.selectInfluencers(req.user.userId, id, applicationIds);
  }

  @ApiOperation({ summary: '체험단 상세 조회', description: '체험단 상세 정보를 반환합니다.' })
  @ApiSuccess()
  @Get('detail/:id')
  async detail(@Param('id', ParseIntPipe) id: number) {
    return this.service.getExperienceDetail(id);
  }

  @ApiOperation({ summary: '체험단 신청 목록', description: '특정 체험단의 신청 내역을 조회합니다.' })
  @ApiSuccess()
  @UseGuards(JwtAuthGuard)
  @Get(':id/applications')
  async applications(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Query('status') status?: ApplicationStatus,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.service.listApplications(req.user.userId, id, status as any, Number(page), Number(limit));
  }

  @ApiOperation({ summary: '체험단 신청 심사', description: '신청을 승인/거절합니다.' })
  @ApiSuccess()
  @UseGuards(JwtAuthGuard)
  @Post('applications/:applicationId/review/:decision')
  async review(@Request() req, @Param('applicationId', ParseIntPipe) applicationId: number, @Param('decision') decision: 'approve' | 'reject') {
    return this.service.reviewApplication(req.user.userId, applicationId, decision);
  }

  @ApiOperation({ summary: '체험단 신청 취소', description: '신청을 취소합니다.' })
  @ApiSuccess()
  @UseGuards(JwtAuthGuard)
  @Post('applications/:applicationId/cancel')
  async cancel(@Request() req, @Param('applicationId', ParseIntPipe) applicationId: number) {
    return this.service.cancelApplication(req.user.userId, applicationId);
  }

  @ApiOperation({ summary: '체험단 상태 변경', description: '캠페인 상태를 변경합니다.' })
  @ApiBody({ schema: { type: 'object', properties: { status: { type: 'string', enum: Object.values(CampaignStatus) } }, required: ['status'] } })
  @ApiSuccess()
  @UseGuards(JwtAuthGuard)
  @Post(':id/status')
  async updateStatus(@Request() req, @Param('id', ParseIntPipe) id: number, @Body('status') status: CampaignStatus) {
    return this.service.updateStatus(req.user.userId, id, status);
  }
}
