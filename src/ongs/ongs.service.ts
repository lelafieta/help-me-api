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

  calculateBlogFeaturedScore(blog: any): number {
  let score = 0;

  const now = new Date();
  const createdAt = new Date(blog.createdAt);
  const daysSinceCreated = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

  // Criado há menos de 7 dias
  if (daysSinceCreated <= 7) score += 2;

  // ONG verificada
  if (blog.ong?.isVerified) score += 2;

  // Título ou descrição com palavras-chave
  const keywords = ['importante', 'urgente', 'destaque', 'apoio', 'alerta'];
  const title = blog.title?.toLowerCase() ?? '';
  const description = blog.description?.toLowerCase() ?? '';

  if (keywords.some(kw => title.includes(kw) || description.includes(kw))) score += 1;

  return score;
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
