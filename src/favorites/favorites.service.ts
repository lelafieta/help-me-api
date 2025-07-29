import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) { }

  async favorite(createFavoriteDto: CreateFavoriteDto) {
    
    return this.prisma.favorite.create({
      data: {
        userId: createFavoriteDto.userId,
        itemId: createFavoriteDto.itemId,
        itemType: createFavoriteDto.itemType,
      },
    });
  }

  async unfavorite(userId: string, itemId: string, itemType: string) {
    return this.prisma.favorite.deleteMany({
      where: { userId, itemId, itemType },
    });
  }

  async listFavorites(userId: string, itemType?: string) {
    return this.prisma.favorite.findMany({
      where: {
        userId,
        ...(itemType ? { itemType } : {}),
      },
    });
  }

  async isFavorited(userId: string, itemId: string, itemType: string) {
    const existing = await this.prisma.favorite.findFirst({
      where: {
        userId,
        itemId,
        itemType,
      },
    });

    return { favorited: !!existing };
  }
}
