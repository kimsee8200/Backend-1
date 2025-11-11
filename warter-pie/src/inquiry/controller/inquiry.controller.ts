import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { InquiryService } from '../service/inquiry.service';
import { CreateInquiryDto } from '../dto/create-inquiry.dto';
import { UpdateInquiryDto } from '../dto/update-inquiry.dto';
import { JwtAuthGuard } from '../../auth/passport/jwt/jwt-auth.guard';
import {
  CurrentUser,
  CurrentUserPayload,
} from '../../user/decorators/current-user.decorator';
import { User } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { InquiryResponseDto } from '../dto/inquiry.response.dto';

@ApiTags('Inquiries')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('inquiries')
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new inquiry' })
  @ApiResponse({
    status: 201,
    description: 'The inquiry has been successfully created.',
    type: InquiryResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(
    @Body() createInquiryDto: CreateInquiryDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.inquiryService.create(createInquiryDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all inquiries for the current user' })
  @ApiResponse({
    status: 200,
    description: 'A list of inquiries.',
    type: [InquiryResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAll(@CurrentUser() user: CurrentUserPayload) {
    return this.inquiryService.findAllForUser(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific inquiry by ID' })
  @ApiResponse({
    status: 200,
    description: 'The inquiry details.',
    type: InquiryResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.inquiryService.findOneForUser(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an inquiry' })
  @ApiResponse({
    status: 200,
    description: 'The inquiry has been successfully updated.',
    type: InquiryResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInquiryDto: UpdateInquiryDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.inquiryService.update(id, updateInquiryDto, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an inquiry' })
  @ApiResponse({
    status: 204,
    description: 'The inquiry has been successfully deleted.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    await this.inquiryService.remove(id, user);
  }
}
