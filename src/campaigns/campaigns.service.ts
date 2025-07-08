import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService) {}

  create(createCampaignDto: CreateCampaignDto) {
    return this.prisma.campaign.create({ data: createCampaignDto });
  }

  findAll() {
    return this.prisma.campaign.findMany();
  }

  findOne(id: string) {
    return this.prisma.campaign.findUnique({ where: { id } });
  }

  update(id: string, updateCampaignDto: UpdateCampaignDto) {
    return this.prisma.campaign.update({ where: { id }, data: updateCampaignDto });
  }

  remove(id: string) {
    return this.prisma.campaign.delete({ where: { id } });
  }
}
