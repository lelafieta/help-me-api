import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  create(createFavoriteDto: Prisma.FavoriteCreateInput) {
    return this.prisma.favorite.create({ data: createFavoriteDto });
  }

  findAll() {
    return this.prisma.favorite.findMany();
  }

  findOne(id: number) {
    return this.prisma.favorite.findUnique({ where: { id } });
  }

  update(id: number, updateFavoriteDto: Prisma.FavoriteUpdateInput) {
    return this.prisma.favorite.update({ where: { id }, data: updateFavoriteDto });
  }

  remove(id: number) {
    return this.prisma.favorite.delete({ where: { id } });
  }
}
