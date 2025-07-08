import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  create(createCategoryDto: Prisma.CategoryCreateInput) {
    return this.prisma.category.create({ data: createCategoryDto });
  }

  findAll() {
    return this.prisma.category.findMany();
  }

  findOne(id: number) {
    return this.prisma.category.findUnique({ where: { id } });
  }

  update(id: number, updateCategoryDto: Prisma.CategoryUpdateInput) {
    return this.prisma.category.update({ where: { id }, data: updateCategoryDto });
  }

  remove(id: number) {
    return this.prisma.category.delete({ where: { id } });
  }
}
