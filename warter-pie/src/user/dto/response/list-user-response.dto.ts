import { User, UserType } from '@prisma/client';

export class ListUserResponseDto {
  id: number;
  email: string;
  name: string;
  phoneNumber: string;
  userType: UserType;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<ListUserResponseDto>) {
    Object.assign(this, partial);
  }

  static fromEntity(entity: any): ListUserResponseDto {
    return new ListUserResponseDto({
      id: entity.id,
      email: entity.email,
      name: entity.name,
      phoneNumber: entity.phoneNumber,
      userType: entity.userType,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
