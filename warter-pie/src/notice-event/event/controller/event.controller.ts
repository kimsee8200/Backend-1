import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { EventService } from '../../service/event.service';
import { JwtAuthGuard } from '../../../auth/passport/jwt/jwt-auth.guard';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';

function filenameEdit(req: any, file: any, callback: (error: Error | null, filename: string) => void) {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  callback(null, uniqueSuffix + extname(file.originalname));
}

@ApiTags('event')
@Controller('event')
export class EventController {
  constructor(private readonly service: EventService) {}

  @ApiOperation({ summary: '이벤트 생성' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor({ storage: diskStorage({ destination: './uploads', filename: filenameEdit }) }))
  @Post()
  async create(@Body() body: CreateEventDto, @UploadedFiles() files: any[]) {
    const images = (files || []).map((f) => `/uploads/${f.filename}`);
    const e = await this.service.createEvent(body.title, body.content, images);
    return { id: e.id, title: e.title, content: e.content, images: e.images.map((i) => i.url), create_at: e.createdAt.toISOString().slice(0, 10), update_at: e.updatedAt.toISOString().slice(0, 10) };
  }

  @ApiOperation({ summary: '이벤트 수정' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor({ storage: diskStorage({ destination: './uploads', filename: filenameEdit }) }))
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateEventDto, @UploadedFiles() files: any[]) {
    const images = (files || []).map((f) => `/uploads/${f.filename}`);
    const e = await this.service.updateEvent(id, body.title, body.content, images);
    return { id: e.id, title: e.title, content: e.content, images: e.images.map((i) => i.url), create_at: e.createdAt.toISOString().slice(0, 10), update_at: e.updatedAt.toISOString().slice(0, 10) };
  }

  @ApiOperation({ summary: '이벤트 삭제' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteEvent(id);
  }

  @ApiOperation({ summary: '이벤트 목록' })
  @Get('list')
  async list() {
    const items = await this.service.listEvent();
    return items.map((e) => ({ id: e.id, title: e.title, create_at: e.createdAt.toISOString().slice(0, 10), update_at: e.updatedAt.toISOString().slice(0, 10) }));
  }

  @ApiOperation({ summary: '이벤트 상세' })
  @Get(':id')
  async detail(@Param('id', ParseIntPipe) id: number) {
    const e = await this.service.findEvent(id);
    return { id: e.id, title: e.title, content: e.content, images: e.images.map((i) => i.url), create_at: e.createdAt.toISOString().slice(0, 10), update_at: e.updatedAt.toISOString().slice(0, 10) };
  }
}
