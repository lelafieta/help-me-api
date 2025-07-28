import { PartialType } from '@nestjs/mapped-types';
import { CreateCampaignContributorDto } from './create-campaign-contributor.dto';

export class UpdateCampaignContributorDto extends PartialType(
  CreateCampaignContributorDto,
) {}
