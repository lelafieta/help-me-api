import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateOngDto } from './dto/create-ong.dto';
import { UpdateOngDto } from './dto/update-ong.dto';

@Injectable()
export class OngsService {
  constructor(private prisma: PrismaService) {}

  async create(createOngDto: CreateOngDto) {
    
    const data = {
      about: createOngDto.about,
      bio: createOngDto.bio,
      coverImageUrl: createOngDto.coverImageUrl,
      isVerified: createOngDto.isVerified ?? false,
      mission: createOngDto.mission,
      name: createOngDto.name,
      phoneNumber: createOngDto.phoneNumber,
      profileImageUrl: createOngDto.profileImageUrl,
      servicesNumber: Number(0), 
      supportsNumber: Number(0), 
      userId: createOngDto.userId ? Number(createOngDto.userId) : undefined,
      vision: createOngDto.vision,
      status: createOngDto.status ?? 'pending',
      email: createOngDto.email,
      website: createOngDto.website,
    };    
    return this.prisma.ong.create({ data });
  }

  findAll() {
    return this.prisma.ong.findMany();
  }

  findOne(id: number) {
    return this.prisma.ong.findUnique({ where: { id } });
  }

  update(id: number, updateOngDto: UpdateOngDto) {
    return this.prisma.ong.update({ where: { id }, data: updateOngDto });
  }

  remove(id: number) {
    return this.prisma.ong.delete({ where: { id } });
  }
}
