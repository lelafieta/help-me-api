import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { CreateCommunityMemberDto } from './dto/create-community-member.dto';

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
          role: 'ADMIN',
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
        members: {
          include: {
            user: true,
          },
        },
        
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

  async addMember(dto: CreateCommunityMemberDto) {
    return this.prisma.communityMember.create({
      data: {
        userId: dto.userId,
        communityId: dto.communityId,
        role: dto.role,
      }
    });
  }

  async removeMember(userId: string, communityId: string) {
    return this.prisma.communityMember.delete({
      where: {
        userId_communityId: {
          userId,
          communityId,
        },
      },
    });
  }

  async listMembers(communityId: string) {
    return this.prisma.communityMember.findMany({
      where: { communityId },
      include: { user: true },
    });
  }

  async updateMemberRole(userId: string, communityId: string, role: string) {
    return this.prisma.communityMember.update({
      where: {
        userId_communityId: { userId, communityId },
      },
      data: { role },
    });
  }

  async isMember(userId: string, communityId: string) {
    return this.prisma.communityMember.findUnique({
      where: {
        userId_communityId: { userId, communityId },
      },
    });
  }

}
