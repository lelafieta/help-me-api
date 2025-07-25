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
        communityId: Number(createEventDto.communityId),

        startDate: createEventDto.startDate ? new Date(createEventDto.startDate) : undefined,
        endDate: createEventDto.endDate ? new Date(createEventDto.endDate) : undefined,
        backgroundImageUrl,
      },
    });

  }

  findAll() {
    return this.prisma.event.findMany();
  }

  getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Raio da Terra em KM
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  async findNearbyEventsSmart(userId: number, radiusKm = 20) {
    const profile = await this.prisma.profile.findUnique({
      where: { id: userId },
      select: { latitude: true, longitude: true },
    });

    if (!profile?.latitude || !profile?.longitude) {
      throw new Error('Usuário sem coordenadas geográficas definidas.');
    }

    const events = await this.prisma.event.findMany({
      where: {
        endDate: {
          gte: new Date(), // eventos ainda válidos
        },
        latitude: {
          not: null,
        },
        longitude: {
          not: null,
        },
      },
      include: {
        ong: true,
      },
    });

    const nearby = events
      .map(event => {
        const dist = this.getDistanceKm(
          Number(profile.latitude),
          Number(profile.longitude),
          Number(event.latitude),
          Number(event.longitude),
        );
        return { ...event, distanceKm: dist };
      })
      .filter(e => e.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    return nearby;
  }

  calculateEventRelevance(event: any, profile?: any): number {
    const now = new Date();
    const start = new Date(event.startDate);
    const daysUntil = (start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

    let score = 0;

    // 1. Evento começa em breve (<= 7 dias)
    if (daysUntil >= 0 && daysUntil <= 7) score += 2;

    // 2. Localização parecida com o usuário
    if (
      profile?.location &&
      event.location &&
      event.location.toLowerCase().includes(profile.location.toLowerCase())
    ) {
      score += 2;
    }

    // 3. Se for evento social ou humanitário (exemplo)
    const relevantTypes = ['doação', 'limpeza', 'saúde', 'comunidade'];
    if (
      event.title &&
      relevantTypes.some(type => event.title.toLowerCase().includes(type))
    ) {
      score += 1;
    }

    return score;
  }

  async findForYouEvents(userId: number, limit = 10) {
    const profile = await this.prisma.profile.findUnique({
      where: { id: userId },
    });

    const events = await this.prisma.event.findMany({
      where: {
        startDate: {
          gte: new Date(), // só eventos futuros
        },
        latitude: { not: null },
        longitude: { not: null },
      },
      include: {
        ong: true,
      },
    });

    const scored = events.map(e => ({
      ...e,
      relevanceScore: this.calculateEventRelevance(e, profile),
    }));

    return scored
      .filter(e => e.relevanceScore >= 2)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);
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
