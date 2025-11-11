export class ExperienceListItemDto {
  id: number;
  data_type: number; // 1=지역, 2=제품
  product_offer_type: number; // 1~4
  cartegory: string;
  channels: number[];
  possible_time_application_left: number;
  title: string;
  offer_content: string;
  member_num: number;
  applicated_num: number;
  each_member_point: number;
  image_urls: string[];
  is_point_experience: boolean;
}
