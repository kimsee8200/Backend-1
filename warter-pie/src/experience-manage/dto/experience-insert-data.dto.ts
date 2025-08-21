export interface ExperienceInsertDataDto {
  data_type: number;
  company_name: string;
  manager_call_num?: string;
  product_offer_type: number; // 1=방문형, 2=포장형, 3=배송형, 4=구매형
  address: string;
  detail_address?: string;
  category?: string;
  product_url?: string;
  channels: number[]; // e.g., [1,2,...]
  possible_time_application: [string, string]; // [startDate, endDate] yyyy-mm-dd
  member_announcement_time: string; // yyyy-mm-dd
  experience_time: [string, string]; // yyyy-mm-dd
  end_review_time: string; // yyyy-mm-dd

  // 방문형 시 세부
  possible_time: [string, string]; // [startHH:mm, endHH:mm]
  possible_week_days: number[]; // 0..6
  possible_visit_now: boolean;
  notices_to_visit?: string;

  experience_mission?: string;
  marketing_keywords?: string[];
  title: string;
  offer_content?: string;
  member_num: number;
  each_member_point: number;
  charge: number;
}
