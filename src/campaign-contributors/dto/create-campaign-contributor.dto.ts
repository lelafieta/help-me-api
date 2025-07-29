import { IsInt, IsBoolean, IsOptional, IsDecimal, IsString } from 'class-validator';

export class CreateCampaignContributorDto {
  @IsString()
  campaignId: string;

  @IsString()
  userId: string;

  @IsDecimal()
  @IsOptional()
  money?: number;

  @IsBoolean()
  @IsOptional()
  isAnonymous?: boolean;
}
