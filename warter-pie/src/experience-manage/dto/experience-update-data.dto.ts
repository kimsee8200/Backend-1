import {
  IsOptional,
  IsString,
  IsInt,
  IsArray,
  IsBoolean,
  ArrayNotEmpty,
} from 'class-validator';

export class ExperienceUpdateDataDto {
  @IsOptional()
  @IsInt()
  data_type?: number; // 1=지역, 2=제품

  @IsOptional()
  @IsString()
  company_name?: string; // 이미지에 componey_name 오탈자 가능성 -> 표준키 사용

  @IsOptional()
  @IsString()
  manager_call_num?: string;

  @IsOptional()
  @IsInt()
  product_offer_type?: number; // 1 방문형 / 2 포장형 / 3 배송형 / 4 구매형

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  detail_address?: string;

  // 명세 이미지 철자: cartegory
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  cartegory?: string;

  @IsOptional()
  @IsString()
  product_url?: string;

  // 명세 이미지 철자: chennals, 숫자 배열
  @IsOptional()
  @IsArray()
  channels?: number[];

  @IsOptional()
  @IsArray()
  chennals?: number[];

  // 날짜 문자열 배열 [start,end]
  @IsOptional()
  @IsArray()
  possible_time_application?: [string, string];

  @IsOptional()
  @IsString()
  member_announcement_time?: string; // yyyy-mm-dd

  @IsOptional()
  @IsArray()
  experience_time?: [string, string]; // yyyy-mm-dd

  @IsOptional()
  @IsString()
  end_review_time?: string; // yyyy-mm-dd

  // 방문형 전용
  @IsOptional()
  @IsArray()
  possible_time?: [string, string]; // ["HH:MM","HH:MM"]

  @IsOptional()
  @IsArray()
  possible_week_days?: number[]; // 0..6

  @IsOptional()
  @IsBoolean()
  possible_visit_now?: boolean;

  @IsOptional()
  @IsString()
  notices_to_visit?: string;

  // 기타
  @IsOptional()
  @IsString()
  experience_mission?: string;

  @IsOptional()
  @IsArray()
  marketing_keywords?: string[];

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  offer_content?: string;

  @IsOptional()
  @IsInt()
  member_num?: number;

  @IsOptional()
  @IsInt()
  each_member_point?: number;

  @IsOptional()
  @IsInt()
  charge?: number;
}
