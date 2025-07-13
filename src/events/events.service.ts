import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { join } from 'path';
import * as fs from 'fs';
import { Multer } from 'multer';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) { }

  async create(createEventDto: CreateEventDto, file: Multer.File, userId: number) {
    let backgroundImageUrl: string | undefined;

    if (file) {
      const uploadDir = 'uploads/events';
      const fileName = `${Date.now()}-${file.originalname}`;
      const filePath = join(process.cwd(), uploadDir, fileName);

      fs.mkdirSync(uploadDir, { recursive: true });
      fs.writeFileSync(filePath, file.buffer);

      backgroundImageUrl = `/${uploadDir}/${fileName}`;
    }

    return this.prisma.event.create({
      data: {
        ongId: Number(createEventDto.ongId),
        userId: Number(userId),
        title: createEventDto.title,
        location: createEventDto.location,
        description: createEventDto.description,
        startDate: createEventDto.startDate ? new Date(createEventDto.startDate) : undefined,
        endDate: createEventDto.endDate ? new Date(createEventDto.endDate) : undefined,
        backgroundImageUrl,
      },
    });

  }

  findAll() {
    return this.prisma.event.findMany();
  }

  findOne(id: number) {
    return this.prisma.event.findUnique({ where: { id } });
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return this.prisma.event.update({ where: { id }, data: updateEventDto });
  }

  remove(id: number) {
    return this.prisma.event.delete({ where: { id } });
  }
}
