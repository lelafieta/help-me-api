import { ApiProperty } from '@nestjs/swagger';

export class CreateUpdateCampaignDto {
  title: string;  
  description: string;
  campaignId: string;
  userId: string;
}
