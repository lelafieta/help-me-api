import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { Prisma } from 'generated/prisma';
import { Multer } from 'multer';

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService) { }
  async create(
    dto: CreateCampaignDto,
    documents: Multer.File[],
    midias: Multer.File[],
    cover: Multer.File, // 📌 Novo parâmetro para a imagem de capa
  ) {
    // 0️⃣ Validação mínima antes de tudo
    if (!cover || !documents?.length || !midias?.length) {
      throw new BadRequestException('Capa, documentos e mídias são obrigatórios.');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1️⃣ Registra documentos primeiro
      const createdDocuments = await Promise.all(
        documents.map((doc) =>
          tx.campaignDocument.create({
            data: {
              documentPath: `/uploads/campaign_documents/${doc.filename}`,
              userId: Number(dto.userId),
              isApproved: false,
            },
          }),
        ),
      );

      // 2️⃣ Registra mídias
      const createdMidias = await Promise.all(
        midias.map((file) => {
          const ext = file.originalname.split('.').pop()?.toLowerCase();
          const isVideo = ['mp4', 'mov', 'avi'].includes(ext ?? '');
          return tx.campaignMidia.create({
            data: {
              midiaUrl: `/uploads/campaign_midias/${file.filename}`,
              userId: Number(dto.userId),
              midiaType: isVideo ? 'video' : 'image',
            },
          });
        }),
      );

      // 3️⃣ Cria a campanha depois de tudo
      const campaign = await tx.campaign.create({
        data: {
          title: dto.title,
          description: dto.description,
          fundraisingGoal: Number(dto.fundraisingGoal),
          imageCoverUrl: `/uploads/campaign_image_cover/${cover.filename}`, // 📌 Caminho da capa
          location: dto.location,
          categoryId: Number(dto.categoryId),
          ongId: Number(dto.ongId),
          phoneNumber: dto.phoneNumber,
          beneficiaryName: dto.beneficiaryName,
          campaignType: dto.campaignType,
          currency: dto.currency ?? 'AOA',
          startDate: dto.startDate ? new Date(dto.startDate) : null,
          endDate:   dto.endDate ? new Date(dto.endDate) : null,
          birth: dto.birth ? new Date(dto.birth) : null,
          isUrgent: Boolean(dto.isUrgent),
          isActivate: Boolean(dto.isActivate),
          userId: Number(dto.userId),

          campaignDocuments: {
            connect: createdDocuments.map((doc) => ({ id: doc.id })),
          },
          campaignMidias: {
            connect: createdMidias.map((midia) => ({ id: midia.id })),
          },
        },
      });

      return campaign;
    });
  }



  findAll() {
    return this.prisma.campaign.findMany();
  }

  findOne(id: number) {
    return this.prisma.campaign.findUnique({ where: { id } });
  }

  update(id: number, updateCampaignDto: Prisma.CampaignUpdateInput) {
    return this.prisma.campaign.update({ where: { id }, data: updateCampaignDto });
  }

  remove(id: number) {
    return this.prisma.campaign.delete({ where: { id } });
  }
}
