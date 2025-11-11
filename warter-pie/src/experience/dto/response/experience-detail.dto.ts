export class ExperienceDetailDto {
  id: number;
  writer: string;
  data_type: number;
  company_name: string;
  manager_call_num: string;
  product_offer_type: number;
  address: string;
  detail_address: string;
  cartegory: string;
  product_url: string;
  channels: number[];
  possible_time_application: string[]; // yyyy-mm-dd
  member_announcement_time: string; // yyyy-mm-dd
  experience_time: string[]; // yyyy-mm-dd
  end_review_time: string; // yyyy-mm-dd
  possible_time: string[]; // HH:MM
  possible_week_days: number[];
  possible_visit_now: boolean;
  notices_to_visit: string;
  experience_mission: string;
  marketing_keywords: string[];
  title: string;
  offer_content: string;
  member_num: number;
  applicated_num: number;
  each_member_point: number;
  image_urls: string[];
  selected_members: string[];
  create_at: string; // yyyy-mm-ddThh:mm
  update_at: string; // yyyy-mm-ddThh:mm
}
