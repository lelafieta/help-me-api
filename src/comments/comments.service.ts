import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCommentDto) {
    if (![dto.postId, dto.blogId, dto.campaignId, dto.eventId].some(Boolean)) {
      throw new BadRequestException(
        'O comentário precisa estar  vinculado a um Post, Blog, Feed, Campanha ou Evento',
      );
    }

    return this.prisma.comment.create({
      data: {
        content: dto.content,
        userId: dto.userId,
        postId: dto.postId,
        blogId: dto.blogId,        
        campaignId: dto.campaignId,
        eventId: dto.eventId,
      },
    });
  }

  async findByPost(postId: string) {
    return this.prisma.comment.findMany({
      where: { postId },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByBlog(blogId: string) {
    return this.prisma.comment.findMany({
      where: { blogId },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByFeed(feedId: string) {
    return this.prisma.comment.findMany({
      where: { feedId },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByCampaign(campaignId: string) {
    return this.prisma.comment.findMany({
      where: { campaignId },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByEvent(eventId: string) {
    return this.prisma.comment.findMany({
      where: { eventId },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.comment.findMany({
      where: { userId },
      include: { post: true, blog: true, campaign: true, event: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, dto: UpdateCommentDto) {
    const existing = await this.prisma.comment.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Comentário não encontrado');

    return this.prisma.comment.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    const existing = await this.prisma.comment.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Comentário não encontrado');

    return this.prisma.comment.delete({
      where: { id },
    });
  }
}
