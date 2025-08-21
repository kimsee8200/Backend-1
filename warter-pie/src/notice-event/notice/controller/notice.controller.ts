import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { NoticeService } from '../../service/notice.service';
import { JwtAuthGuard } from '../../../auth/passport/jwt/jwt-auth.guard';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateNoticeDto } from '../dto/create-notice.dto';
import { UpdateNoticeDto } from '../dto/update-notice.dto';

function filenameEdit(req: any, file: any, callback: (error: Error | null, filename: string) => void) {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  callback(null, uniqueSuffix + extname(file.originalname));
}

@ApiTags('notice')
@Controller('notice')
export class NoticeController {
  constructor(private readonly service: NoticeService) {}

  @ApiOperation({ summary: '공지 생성' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor({ storage: diskStorage({ destination: './uploads', filename: filenameEdit }) }))
  @Post()
  async create(@Body() body: CreateNoticeDto, @UploadedFiles() files: any[]) {
    const images = (files || []).map((f) => `/uploads/${f.filename}`);
    const n = await this.service.createNotice(body.title, body.content, images);
    return { id: n.id, title: n.title, content: n.content, images: n.images.map((i) => i.url), create_at: n.createdAt.toISOString().slice(0, 10), update_at: n.updatedAt.toISOString().slice(0, 10) };
  }

  @ApiOperation({ summary: '공지 수정' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor({ storage: diskStorage({ destination: './uploads', filename: filenameEdit }) }))
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateNoticeDto, @UploadedFiles() files: any[]) {
    const images = (files || []).map((f) => `/uploads/${f.filename}`);
    const n = await this.service.updateNotice(id, body.title, body.content, images);
    return { id: n.id, title: n.title, content: n.content, images: n.images.map((i) => i.url), create_at: n.createdAt.toISOString().slice(0, 10), update_at: n.updatedAt.toISOString().slice(0, 10) };
  }

  @ApiOperation({ summary: '공지 삭제' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteNotice(id);
  }

  @ApiOperation({ summary: '공지 목록' })
  @Get('list')
  async list() {
    const items = await this.service.listNotice();
    return items.map((n) => ({ id: n.id, title: n.title, create_at: n.createdAt.toISOString().slice(0, 10), update_at: n.updatedAt.toISOString().slice(0, 10) }));
  }

  @ApiOperation({ summary: '공지 상세' })
  @Get(':id')
  async detail(@Param('id', ParseIntPipe) id: number) {
    const n = await this.service.findNotice(id);
    return { id: n.id, title: n.title, content: n.content, images: n.images.map((i) => i.url), create_at: n.createdAt.toISOString().slice(0, 10), update_at: n.updatedAt.toISOString().slice(0, 10) };
  }
}
