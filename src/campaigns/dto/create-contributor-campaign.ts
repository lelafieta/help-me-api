import { ApiProperty } from '@nestjs/swagger';

export class CampaignContributorResponseDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  money: number;
  isAnonymous: boolean;
  campaignId: string
}
