import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { ToggleLikeDto } from './dto/toggle-like.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class LikesService {
   constructor(private readonly prisma: PrismaService) {}
  create(createLikeDto: CreateLikeDto) {
    return 'This action adds a new like';
  }

  async toggleLike(dto: ToggleLikeDto) {
    // Garante que só um alvo foi informado
    const targets = [dto.postId, dto.blogId, dto.feedId].filter(Boolean);
    if (targets.length !== 1) {
      throw new BadRequestException('Informe exatamente um tipo de alvo para o like.');
    }

    // Procura se já existe um like
    const existingLike = await this.prisma.like.findFirst({
      where: {
        userId: dto.userId,
        postId: dto.postId ?? undefined,
        blogId: dto.blogId ?? undefined,
        feedId: dto.feedId ?? undefined,
      },
    });

    if (existingLike) {
      // Remove o like
      await this.prisma.like.delete({ where: { id: existingLike.id } });
      return { liked: false };
    } else {
      // Cria o like
      await this.prisma.like.create({ data: dto });
      return { liked: true };
    }
  }


  findAll() {
    return `This action returns all likes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} like`;
  }

  update(id: number, updateLikeDto: UpdateLikeDto) {
    return `This action updates a #${id} like`;
  }

  remove(id: number) {
    return `This action removes a #${id} like`;
  }
}
