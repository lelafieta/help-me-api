import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateOngDto } from './dto/create-ong.dto';
import { UpdateOngDto } from './dto/update-ong.dto';
import { Blog, Ong } from '@prisma/client';

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
      userId: createOngDto.userId ? createOngDto.userId : undefined,
      vision: createOngDto.vision,
      status: createOngDto.status ?? 'pending',
      email: createOngDto.email,
      website: createOngDto.website,
    };
    return this.prisma.ong.create({ data });
  }

  calculateBlogFeaturedScore(blog: Blog & { ong: Ong | null }): number {
    let score = 0;

    const now = new Date();
    const createdAt = new Date(blog.createdAt);
    const daysSinceCreated =
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

    // Criado há menos de 7 dias
    if (daysSinceCreated <= 7) score += 2;

    // ONG verificada
    if (blog.ong?.isVerified) score += 2;

    // Título ou descrição com palavras-chave
    const keywords = ['importante', 'urgente', 'destaque', 'apoio', 'alerta'];
    const title = blog.title?.toLowerCase() ?? '';
    const description = blog.description?.toLowerCase() ?? '';

    if (keywords.some((kw) => title.includes(kw) || description.includes(kw)))
      score += 1;

    return score;
  }

  async findPopularOngs(limit = 10) {
    const ongs = await this.prisma.ong.findMany({
      include: {
        campaigns: true,
        events: true,
        feeds: true,
      },
    });

    const scored = ongs.map((ong) => ({
      ...ong,
      popularityScore: this.calculateOngPopularity(ong),
    }));

    return scored
      .filter((o) => o.popularityScore >= 2)
      .sort((a, b) => b.popularityScore - a.popularityScore)
      .slice(0, limit);
  }

  calculateOngPopularity(
    ong: Ong & { campaigns: any[]; events: any[]; feeds: any[] },
  ): number {
    let score = 0;

    if (ong.isVerified) score += 2;
    if (ong.campaigns?.length > 0) score += 1;
    if (ong.events?.length > 0) score += 1;
    if (ong.feeds?.length > 0) score += 1;
    if (ong.website) score += 1;
    if (ong.profileImageUrl) score += 1;

    return score;
  }

  findAll() {
    return this.prisma.ong.findMany({ include: { user: true } });
  }

  findOne(id: string) {
    return this.prisma.ong.findUnique({ where: { id } });
  }

  update(id: string, updateOngDto: UpdateOngDto) {
    return this.prisma.ong.update({ where: { id }, data: updateOngDto });
  }

  remove(id: string) {
    return this.prisma.ong.delete({ where: { id } });
  }
}
