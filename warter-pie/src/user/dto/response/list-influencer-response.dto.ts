import { ListUserResponseDto } from './list-user-response.dto';

export class ListInfluencerResponseDto extends ListUserResponseDto {
    youtubeUrl: string;
    instagramUrl: string;
    blogUrl: string;
    tiktokUrl: string;

    constructor(partial: Partial<ListInfluencerResponseDto>) {
        super(partial);
        Object.assign(this, partial);
    }

    static fromEntity(entity: any): ListInfluencerResponseDto {
        return new ListInfluencerResponseDto({
            ...ListUserResponseDto.fromEntity(entity),
            youtubeUrl: entity.influencer?.youtubeUrl || null,
            instagramUrl: entity.influencer?.instagramUrl || null,
            blogUrl: entity.influencer?.blogUrl || null,
            tiktokUrl: entity.influencer?.tiktokUrl || null
        });
    }
    
    static fromEntities(entities: any[]): ListInfluencerResponseDto[] {
        return entities.map(entity => this.fromEntity(entity));
    }
}
