// impacts.service.ts
import { Injectable } from '@nestjs/common';
import { CreateImpactDto } from './dto/create-impact.dto';
import { PrismaService } from 'src/database/prisma.service';


@Injectable()
export class ImpactsService {
  constructor(private readonly prisma: PrismaService) {}

  async createImpactWithMedia(
    dto: CreateImpactDto,
    files: Express.Multer.File[],
  ) {
    return this.prisma.$transaction(async (tx) => {
      const impact = await tx.impact.create({
        data: {
          title: dto.title,
          content: dto.content,
          ongId: dto.ongId,
          userId: dto.userId,
          date: dto.date,
        },
      });

      const mediaRecords = files.map((file) => {
        const extension = file.originalname.split('.').pop()?.toLowerCase();
        const type =
          extension === 'mp4' || extension === 'mov'
            ? 'video'
            : 'image';

        return {
          mediaUrl: `/uploads/impacts/${file.filename}`,
          mediaType: type,
          impactId: impact.id,
        };
      });

      await tx.impactMedia.createMany({
        data: mediaRecords,
      });

      return impact;
    });
  }
}
