import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCampaignContributorDto } from './dto/create-campaign-contributor.dto';
import { UpdateCampaignContributorDto } from './dto/update-campaign-contributor.dto';
import { CampaignContributor } from '@prisma/client';

@Injectable()
export class CampaignContributorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createCampaignContributorDto: CreateCampaignContributorDto,
  ): Promise<CampaignContributor> {
    return await this.prisma.campaignContributor.create({
      data: createCampaignContributorDto,
    });
  }

  async findAll(){
    return await this.prisma.campaignContributor.findMany({
      include: {
        user: true,
      },
    });
  }

  async getContributorsByCampaign(camapaignId: number){
    return await this.prisma.campaignContributor.findMany({ where: { campaignId: camapaignId } });
  }

  async findOne(id: number): Promise<CampaignContributor | null> {
    return await this.prisma.campaignContributor.findUnique({
      where: { id },
    });
  }

  async update(
    id: number,
    updateCampaignContributorDto: UpdateCampaignContributorDto,
  ): Promise<CampaignContributor> {
    return await this.prisma.campaignContributor.update({
      where: { id },
      data: updateCampaignContributorDto,
    });
  }

  async remove(id: number): Promise<CampaignContributor> {
    return await this.prisma.campaignContributor.delete({
      where: { id },
    });
  }
}
