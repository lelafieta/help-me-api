import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CampaignContributorsService } from './campaign-contributors.service';
import { CreateCampaignContributorDto } from './dto/create-campaign-contributor.dto';
import { UpdateCampaignContributorDto } from './dto/update-campaign-contributor.dto';

@Controller('campaign-contributors')
export class CampaignContributorsController {
  constructor(
    private readonly campaignContributorsService: CampaignContributorsService,
  ) {}

  @Post()
  create(@Body() createCampaignContributorDto: CreateCampaignContributorDto) {
    return this.campaignContributorsService.create(
      createCampaignContributorDto,
    );
  }

  @Get('/campaign/:campaignId')
  getContributorsByCampaign(@Param('campaignId') campaignId: string) {
    return this.campaignContributorsService.getContributorsByCampaign(campaignId);
  }

  @Get()
  findAll() {
    return this.campaignContributorsService.findAll();
  }
  

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campaignContributorsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCampaignContributorDto: UpdateCampaignContributorDto,
  ) {
    return this.campaignContributorsService.update(
      id,
      updateCampaignContributorDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campaignContributorsService.remove(id);
  }
}
