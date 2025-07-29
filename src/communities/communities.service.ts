import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';

@Injectable()
export class CommunitiesService {
  constructor(private prisma: PrismaService) {}

  create(createCommunityDto: CreateCommunityDto) {
    return this.prisma.community.create({ data: createCommunityDto });
  }

  findAll() {
    return this.prisma.community.findMany();
  }

  findOne(id: string) {
    return this.prisma.community.findUnique({ where: { id } });
  }

  update(id: string, updateCommunityDto: UpdateCommunityDto) {
    return this.prisma.community.update({
      where: { id },
      data: updateCommunityDto,
    });
  }

  remove(id: string) {
    return this.prisma.community.delete({ where: { id } });
  }
}
