import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class FeedsService {
  constructor(private prisma: PrismaService) {}

  async create(createFeedDto: CreateFeedDto, file?: Express.Multer.File) {
    let imagePath: string | null = null;

    if (file) {
      imagePath = `/uploads/feeds/${file.filename}`;
    }

    return this.prisma.feed.create({
      data: {
        title: createFeedDto.title,
        description: createFeedDto.description,
        image: imagePath,
        userId: Number(createFeedDto.userId), // 👈 conversão para número
        ongId: Number(createFeedDto.ongId), // 👈 conversão para número
      },
    });
  }

  async findAll() {
    return this.prisma.feed.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        ong: true,
        FeedComment: true,
        FeedLike: true,
        FeedView: true,
      },
    });
  }

  async findOne(id: number) {
    const feed = await this.prisma.feed.findUnique({
      where: { id },
      include: {
        user: true,
        ong: true,
        FeedComment: true,
        FeedLike: true,
        FeedView: true,
      },
    });

    if (!feed) {
      throw new NotFoundException(`Feed com ID ${id} não encontrado.`);
    }

    return feed;
  }

  async update(id: number, updateFeedDto: UpdateFeedDto) {
    // Verifica se o feed existe
    await this.findOne(id);

    return this.prisma.feed.update({
      where: { id },
      data: {
        title: updateFeedDto.title,
        description: updateFeedDto.description,
        image: updateFeedDto.image,
      },
    });
  }

  async remove(id: number) {
    // Verifica se o feed existe
    await this.findOne(id);

    return this.prisma.feed.delete({
      where: { id },
    });
  }
}
