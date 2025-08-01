import { ListInfluencerResponseDto } from "./list-influencer-response.dto";


export class ListBrandManagerResponseDto extends ListInfluencerResponseDto {
    businessRegistrationNumber: string;
 
    address: string;
 
    detailedAddress: string;


    constructor(partial: Partial<ListBrandManagerResponseDto>) {
        super(partial);
        Object.assign(this, partial);
    }

    static fromEntity(entity: any): ListBrandManagerResponseDto {
        return new ListBrandManagerResponseDto({
            ...ListInfluencerResponseDto.fromEntity(entity),
            businessRegistrationNumber: entity.brandManager?.businessRegistrationNumber || null,
            address: entity.brandManager?.address || null,
            detailedAddress: entity.brandManager?.detailedAddress || null
        });
    }

    static fromEntities(entities: any[]): ListBrandManagerResponseDto[] {
        return entities.map(entity => this.fromEntity(entity));
    }
}
