import { IsInt, IsBoolean, IsOptional, IsDecimal } from 'class-validator';

export class CreateCampaignContributorDto {
  @IsInt()
  campaignId: number;

  @IsInt()
  userId: number;

  @IsDecimal()
  @IsOptional()
  money?: number;

  @IsBoolean()
  @IsOptional()
  isAnonymous?: boolean;
}
