import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { Prisma } from 'generated/prisma';

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService) {}

  create(createCampaignDto: Prisma.CampaignCreateInput) {
    return this.prisma.campaign.create({ data: createCampaignDto });
  }

  findAll() {
    return this.prisma.campaign.findMany();
  }

  findOne(id: number) {
    return this.prisma.campaign.findUnique({ where: { id } });
  }

  update(id: number, updateCampaignDto: Prisma.CampaignUpdateInput) {
    return this.prisma.campaign.update({ where: { id }, data: updateCampaignDto });
  }

  remove(id: number) {
    return this.prisma.campaign.delete({ where: { id } });
  }
}
