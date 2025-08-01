import { ListUserResponseDto } from './list-user-response.dto';

export class ListMarketingAgencyResponseDto extends ListUserResponseDto {
   businessRegistrationNumber: string;
 
   address: string;
 
   detailedAddress: string;

    constructor(partial: Partial<ListMarketingAgencyResponseDto>) {
        super(partial);
        Object.assign(this, partial);
    }

    static fromEntity(entity: any): ListMarketingAgencyResponseDto {
        return new ListMarketingAgencyResponseDto({
            ...ListUserResponseDto.fromEntity(entity),
            businessRegistrationNumber: entity.marketingAgency?.businessRegistrationNumber || null,
            address: entity.marketingAgency?.address || null,
            detailedAddress: entity.marketingAgency?.detailedAddress || null
        });
    }

    static fromEntities(entities: any[]): ListMarketingAgencyResponseDto[] {
        return entities.map(entity => this.fromEntity(entity));
    }
}
