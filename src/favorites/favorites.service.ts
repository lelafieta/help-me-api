import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  create(createFavoriteDto: CreateFavoriteDto) {
    return this.prisma.favorite.create({ data: createFavoriteDto });
  }

  findAll() {
    return this.prisma.favorite.findMany();
  }

  findOne(id: string) {
    return this.prisma.favorite.findUnique({ where: { id } });
  }

  update(id: string, updateFavoriteDto: UpdateFavoriteDto) {
    return this.prisma.favorite.update({ where: { id }, data: updateFavoriteDto });
  }

  remove(id: string) {
    return this.prisma.favorite.delete({ where: { id } });
  }
}
