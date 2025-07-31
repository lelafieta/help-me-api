import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCampaignContributorDto } from './dto/create-campaign-contributor.dto';
import { UpdateCampaignContributorDto } from './dto/update-campaign-contributor.dto';
import { CampaignContributor } from '@prisma/client';

@Injectable()
export class CampaignContributorsService {
  constructor(private readonly prisma: PrismaService) { }
async create(
  createCampaignContributorDto: CreateCampaignContributorDto,
): Promise<CampaignContributor> {
  return this.prisma.$transaction(async (tx) => {
    // 1. Cria o contribuidor
    const contributor = await tx.campaignContributor.create({
      data: createCampaignContributorDto,
    });

    // 2. Atualiza os dados da campanha diretamente com incremento
    await tx.campaign.update({
      where: { id: createCampaignContributorDto.campaignId },
      data: {
        fundsRaised: {
          increment: Number(createCampaignContributorDto.money),
        },
        numberOfContributions: {
          increment: 1,
        },
      },
    });

    return contributor;
  });
}


  async findAll() {
    return await this.prisma.campaignContributor.findMany({
      include: {
        user: true,
      },
    });
  }

  async getContributorsByCampaign(camapaignId: string) {
    return await this.prisma.campaignContributor.findMany({ where: { campaignId: camapaignId } });
  }

  async findOne(id: string): Promise<CampaignContributor | null> {
    return await this.prisma.campaignContributor.findUnique({
      where: { id },
    });
  }

  async update(
    id: string,
    updateCampaignContributorDto: UpdateCampaignContributorDto,
  ): Promise<CampaignContributor> {
    return await this.prisma.campaignContributor.update({
      where: { id },
      data: updateCampaignContributorDto,
    });
  }

  async remove(id: string): Promise<CampaignContributor> {
    return await this.prisma.campaignContributor.delete({
      where: { id },
    });
  }
}
