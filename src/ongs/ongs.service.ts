import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateOngDto } from './dto/create-ong.dto';
import { UpdateOngDto } from './dto/update-ong.dto';

@Injectable()
export class OngsService {
  constructor(private prisma: PrismaService) {}

  create(createOngDto: CreateOngDto) {
    return this.prisma.ong.create({ data: createOngDto });
  }

  findAll() {
    return this.prisma.ong.findMany();
  }

  findOne(id: string) {
    return this.prisma.ong.findUnique({ where: { id } });
  }

  update(id: string, updateOngDto: UpdateOngDto) {
    return this.prisma.ong.update({ where: { id }, data: updateOngDto });
  }

  remove(id: string) {
    return this.prisma.ong.delete({ where: { id } });
  }
}
