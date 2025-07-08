import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogsService {
  constructor(private prisma: PrismaService) {}

  create(createBlogDto: CreateBlogDto) {
    return this.prisma.blog.create({ data: createBlogDto });
  }

  findAll() {
    return this.prisma.blog.findMany();
  }

  findOne(id: String) {
    return this.prisma.blog.findUnique({ where: { id } });
  }

  update(id: String, updateBlogDto: UpdateBlogDto) {
    return this.prisma.blog.update({ where: { id }, data: updateBlogDto });
  }

  remove(id: number) {
    return this.prisma.blog.delete({ where: { id } });
  }
}
