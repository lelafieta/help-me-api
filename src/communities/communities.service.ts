import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';

@Injectable()
export class CommunitiesService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateCommunityDto, image?: Express.Multer.File) {
    return this.prisma.$transaction(async (tx) => {
    // 1️⃣ Cria a comunidade
    const community = await tx.community.create({
      data: {
        name: dto.name,
        description: dto.description,
        ownerId: dto.ownerId,
        location: dto.location,
        imageUrl: image ? `/uploads/community_images/${image.filename}` : null,
      },
    });

    // 2️⃣ Adiciona o criador como membro automaticamente
    await tx.communityMember.create({
      data: {
        userId: dto.ownerId,
        communityId: community.id,
        role: 'admin',
      },
    });

    return community;
  });
  }

  async findAllByUser(userId: string) {
  return this.prisma.community.findMany({
    where: {
      OR: [
        { ownerId: userId },
        {
          members: {
            some: { userId },
          },
        },
      ],
    },
    include: {
      members: true,
      _count: {
        select: {
          members: true,
        },
      },
    },
  });
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
