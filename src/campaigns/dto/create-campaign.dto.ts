import { IsString, IsOptional, IsNumber, IsDate, IsBoolean } from 'class-validator';
import { CampaignStatus } from 'generated/prisma';

export class CreateCampaignDto {
  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  fundraisingGoal?: number;

  @IsOptional()
  @IsNumber()
  fundsRaised?: number;

  @IsOptional()
  @IsString()
  imageCoverUrl?: string;

  @IsOptional()
  @IsString()
  institution?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  numberOfContributions?: number;

  @IsOptional()
  @IsString()
  ongId?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsNumber()
  priority?: number;

  @IsOptional()
  @IsDate()
  endDate?: Date;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @IsBoolean()
  isUrgent?: boolean;

  @IsOptional()
  @IsBoolean()
  isActivate?: boolean;

  @IsOptional()
  @IsString()
  beneficiaryName?: string;

  @IsOptional()
  @IsString()
  campaignType?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsDate()
  birth?: Date;

  @IsOptional()  
  status?: CampaignStatus;
}