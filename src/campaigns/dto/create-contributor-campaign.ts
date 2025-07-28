import { ApiProperty } from '@nestjs/swagger';

export class CampaignContributorResponseDto {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  money: number;
  isAnonymous: boolean;
}
