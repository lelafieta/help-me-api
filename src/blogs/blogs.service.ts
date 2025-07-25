import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { join } from 'path';
import { Multer } from 'multer';
import * as fs from 'fs';

@Injectable()
export class BlogsService {
  constructor(private prisma: PrismaService) { }

  async create(createBlogDto: CreateBlogDto, file: Multer.File) {
    if (!createBlogDto) {
      throw new Error('Dados do blog não foram enviados.');
    }

    let imageUrl: string | undefined;

    if (file) {
      const uploadDir = 'uploads/blogs';
      const fileName = `${Date.now()}-${file.originalname}`;
      const filePath = join(process.cwd(), uploadDir, fileName);

      fs.mkdirSync(uploadDir, { recursive: true });
      fs.writeFileSync(filePath, file.buffer);

      imageUrl = `/${uploadDir}/${fileName}`;
    }

    return this.prisma.blog.create({
      data: {
        ongId: Number(createBlogDto.ongId),
        userId: Number(createBlogDto.userId),
        title: createBlogDto.title ?? '',
        description: createBlogDto.description ?? '',
        image: imageUrl ?? '',
      },
    });
  }

  findAll() {
    return this.prisma.blog.findMany();
  }

  findOne(id: number) {
    return this.prisma.blog.findUnique({ where: { id } });
  }

  async findFeaturedBlogs(limit = 10) {
    const blogs = await this.prisma.blog.findMany({
      where: {
        image: { not: null },
      },
      include: {
        ong: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const scored = blogs.map(blog => ({
      ...blog,
      featuredScore: this.calculateBlogFeaturedScore(blog),
    }));

    return scored
      .filter(b => b.featuredScore >= 3)
      .sort((a, b) => b.featuredScore - a.featuredScore)
      .slice(0, limit);
  }

  async findForYouBlogs(userId: number, limit = 10) {
  const profile = await this.prisma.profile.findUnique({
    where: { id: userId },
  });

  const blogs = await this.prisma.blog.findMany({
    where: {
      createdAt: {
        gte: new Date(new Date().setMonth(new Date().getMonth() - 3)), // últimos 3 meses
      },
    },
    include: {
      ong: true,
    },
  });

  const scored = blogs.map(blog => ({
    ...blog,
    relevanceScore: this.calculateBlogRelevance(blog, profile),
  }));

  return scored
    .filter(b => b.relevanceScore >= 2)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);
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

  calculateBlogRelevance(blog: any, profile?: any): number {
  let score = 0;

  // 1. Criado recentemente
  const now = new Date();
  const createdAt = new Date(blog.createdAt);
  const daysAgo = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
  if (daysAgo <= 7) score += 1;

  // 2. ONG verificada
  if (blog.ong?.isVerified) score += 1;

  // 3. Localização semelhante
  if (
    profile?.location &&
    blog.ong?.name &&
    blog.ong.name.toLowerCase().includes(profile.location.toLowerCase())
  ) {
    score += 1;
  }

  // 4. Conteúdo relevante (keywords)
  const keywords = ['doação', 'apoio', 'comunidade', 'solidariedade', 'saúde'];
  const content = `${blog.title ?? ''} ${blog.description ?? ''}`.toLowerCase();
  if (keywords.some(k => content.includes(k))) score += 2;

  return score;
}


  update(id: number, updateBlogDto: UpdateBlogDto) {

    return this.prisma.blog.update({
      where: { id }, data: {
        ongId: (updateBlogDto.ongId !== undefined) ? Number(updateBlogDto.ongId) : undefined,
        userId: Number(updateBlogDto.userId),
        title: updateBlogDto.title !== null ? updateBlogDto.title : '',
        description: updateBlogDto.description !== null ? updateBlogDto.description : '',
      }
    });
  }

  remove(id: number) {
    return this.prisma.blog.delete({ where: { id } });
  }
}
