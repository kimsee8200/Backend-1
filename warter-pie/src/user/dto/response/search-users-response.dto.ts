import { ApiProperty } from '@nestjs/swagger';
import { ListUserResponseDto } from './list-user-response.dto';
import { PaginationMetaDto } from './pagination-meta.dto';

export class SearchUsersResponseDto {
  @ApiProperty({ type: [ListUserResponseDto] })
  users: ListUserResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  pagination: PaginationMetaDto;
}
