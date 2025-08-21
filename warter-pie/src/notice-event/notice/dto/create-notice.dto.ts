import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNoticeDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  // 컨트롤러에서 파일 업로드 후 주입
  images?: string[];
}
