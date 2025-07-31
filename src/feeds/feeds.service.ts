import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { PrismaService } from 'src/database/prisma.service';
import { CreateViewDto } from './dto/create-view.dto';
import { CreateLikeDto } from './dto/create-like.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class FeedsService {
  constructor(private prisma: PrismaService) { }


  async createFeed(dto: CreateFeedDto, imageUrl: string | null, userId?: string) {
    return this.prisma.$transaction(async (tx) => {
      const newFeed = await tx.feed.create({
        data: {
          title: dto.title,
          description: dto.description,
          userId: userId || dto.userId,
          ongId: dto.ongId,
          image: imageUrl,
          views: 0,
          likes: 0,
          comments: 0,
        },
      });

      // Aqui você pode criar notificações, logs, etc. dentro da transação
      return newFeed;
    });
  }


  async getAllFeeds() {
    return this.prisma.feed.findMany({
      include: {
        feedComment: true,
        feedLike: true,
        feedView: true,
        user: true,
        ong: true,
      },
    });
  }

  async commentFeed(dto: CreateCommentDto) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Cria o comentário
      const comment = await tx.feedComment.create({ data: dto });

      // 2. Incrementa o contador de comentários no feed
      await tx.feed.update({
        where: { id: dto.feedId },
        data: { comments: { increment: 1 } },
      });

      

      return comment;
    });
  }

  async toggleLikeFeed(feedId: string, userId: string) {
  return this.prisma.$transaction(async (tx) => {
    const existingLike = await tx.feedLike.findFirst({
      where: {
        feedId,
        userId,
      },
    });

    if (existingLike) {
      // Remover like
      await tx.feedLike.delete({
        where: { id: existingLike.id },
      });

      await tx.feed.update({
        where: { id: feedId },
        data: { likes: { decrement: 1 } },
      });

      return { liked: false, message: 'Like removido com sucesso' };
    } else {
      // Criar like
      await tx.feedLike.create({
        data: { feedId, userId },
      });

      await tx.feed.update({
        where: { id: feedId },
        data: { likes: { increment: 1 } },
      });

      return { liked: true, message: 'Feed curtido com sucesso' };
    }
  });
}


  async getFeedById(feedId: string, userId?: string, ip?: string, userAgent?: string) {
    return this.prisma.$transaction(async (tx) => {
      // Verifica se já visualizou (com base em userId ou ip)
      const alreadyViewed = await tx.feedView.findFirst({
        where: {
          feedId,
          OR: [
            { userId: userId ?? undefined },
            { ip: userId ? undefined : ip }, // só usa IP se não tiver userId
          ],
        },
      });

      if (!alreadyViewed) {
        // Cria o registro da view
        await tx.feedView.create({
          data: { feedId, userId, ip, userAgent },
        });

        // Incrementa o contador de views
        await tx.feed.update({
          where: { id: feedId },
          data: { views: { increment: 1 } },
        });
      }

      // Retorna os detalhes do feed
      return tx.feed.findUnique({
        where: { id: feedId },
        include: {
          feedComment: true,
          feedLike: true,
          feedView: true,
        },
      });
    });
  }


  async deleteFeed(feedId: string, userId: string) {
    // Verifica se o feed existe e pertence ao usuário
    const feed = await this.prisma.feed.findUnique({ where: { id: feedId } });

    if (!feed) {
      throw new NotFoundException('Feed not found');
    }

    if (feed.userId !== userId) {
      throw new ForbiddenException('You are not allowed to delete this feed');
    }

    // Deleta tudo em transação
    return this.prisma.$transaction(async (tx) => {
      await tx.feedComment.deleteMany({ where: { feedId } });
      await tx.feedLike.deleteMany({ where: { feedId } });
      await tx.feedView.deleteMany({ where: { feedId } });
      await tx.feed.delete({ where: { id: feedId } });

      return { message: 'Feed deleted successfully' };
    });
  }


}
