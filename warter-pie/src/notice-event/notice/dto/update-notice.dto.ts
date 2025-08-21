import { IsOptional, IsString } from 'class-validator';

export class UpdateNoticeDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  // 컨트롤러에서 파일 업로드 후 주입
  images?: string[];
}
