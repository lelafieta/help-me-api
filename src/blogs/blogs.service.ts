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
