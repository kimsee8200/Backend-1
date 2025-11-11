import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { InquiryService } from '../service/inquiry.service';
import { AnswerInquiryDto } from '../dto/answer-inquiry.dto';
import { JwtAuthGuard } from '../../auth/passport/jwt/jwt-auth.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { InquiryResponseDto } from '../dto/inquiry.response.dto';

@ApiTags('Admin/Inquiries')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/inquiries')
export class InquiryAdminController {
  constructor(private readonly inquiryService: InquiryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all inquiries (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'A list of all inquiries.',
    type: [InquiryResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll() {
    return this.inquiryService.findAllForAdmin();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific inquiry by ID (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'The inquiry details.',
    type: InquiryResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inquiryService.findOneForAdmin(id);
  }

  @Patch(':id/answer')
  @ApiOperation({ summary: 'Answer an inquiry (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'The inquiry has been successfully answered.',
    type: InquiryResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  answer(
    @Param('id', ParseIntPipe) id: number,
    @Body() answerInquiryDto: AnswerInquiryDto,
  ) {
    return this.inquiryService.answer(id, answerInquiryDto);
  }

  @Delete(':id/answer')
  @HttpCode(HttpStatus.NO_CONTENT) // 204 No Content for successful deletion/cancellation
  @ApiOperation({ summary: 'Cancel an inquiry answer (Admin)' })
  @ApiResponse({
    status: 204,
    description: 'The inquiry answer has been successfully cancelled.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request (e.g., inquiry not answered).',
  })
  async cancelAnswer(@Param('id', ParseIntPipe) id: number) {
    await this.inquiryService.cancelAnswer(id);
  }
}
