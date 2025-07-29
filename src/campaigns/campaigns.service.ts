import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { Prisma } from 'generated/prisma';
import { Multer } from 'multer';
import { CampaignContributorResponseDto } from './dto/create-contributor-campaign';

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService) { }
  async create(
    dto: CreateCampaignDto,
    documents: Express.Multer.File[],
    midias: Express.Multer.File[],
    cover: Express.Multer.File, // 📌 Novo parâmetro para a imagem de capa
  ) {
    // 0️⃣ Validação mínima antes de tudo
    if (!cover || !documents?.length || !midias?.length) {
      throw new BadRequestException('Capa, documentos e mídias são obrigatórios.');
    }

    return this.prisma.$transaction(async (tx) => {

      
      const createdDocuments = await Promise.all(
        documents.map((doc) =>
          tx.campaignDocument.create({
            data: {
              documentPath: `/uploads/campaign_documents/${doc.filename}`,
              userId: dto.userId,
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
              userId: dto.userId,
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
          imageCoverUrl: `/uploads/campaign_midias/${cover.filename}`, // 📌 Caminho da capa
          location: dto.location,
          categoryId: dto.categoryId,
          ongId: dto.ongId,
          phoneNumber: dto.phoneNumber,
          beneficiaryName: dto.beneficiaryName,
          campaignType: dto.campaignType,
          currency: dto.currency ?? 'AOA',
          startDate: dto.startDate ? new Date(dto.startDate) : null,
          endDate: dto.endDate ? new Date(dto.endDate) : null,
          birth: dto.birth ? new Date(dto.birth) : null,
          isActivate: Boolean(dto.isActivate),
          userId: dto.userId,
          status: dto.status !== undefined ? String(dto.status) : undefined,
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

  createUpdateCampaign(updateCampaignDto: UpdateCampaignDto){
    return this.prisma.campaignUpdate.create({ data: updateCampaignDto });
  }

  findAll() {
    return this.prisma.campaign.findMany({
      include: {
        category: true,
        ong: true,
        user: true,
        campaignDocuments: true,
        campaignMidias: true,
        campaignUpdates: true,
        campaignContributors: true,
        campaignComments: true,
      },
    });
  }

  createCampaignContributor(createContributorDto: CampaignContributorResponseDto) {
    return this.prisma.campaignContributor.create({ data: createContributorDto });
  }

  getAllCampaignContributor(campaignId: string) {
    // Não terminei de implementar
    return this.prisma.campaign.findMany({
      where: {
        userId: campaignId,
      },
      include: {
        category: true,
        ong: true,
        user: true,
        campaignDocuments: true,
        campaignMidias: true,
        campaignUpdates: true,
        campaignContributors: true,
        campaignComments: true,
      },
    });
  }

  findCampaignsByUserId(userId: string) {
    return this.prisma.campaign.findMany({
      where: {
        userId: userId,
      },
      include: {
        category: true,
        ong: true,
        user: true,
        campaignDocuments: true,
        campaignMidias: true,
        campaignUpdates: true,
        campaignContributors: true,
        campaignComments: true,
      },
    });
  }

  async findMyCampaignsByStatus(userId: string, status: string) {
    return this.prisma.campaign.findMany({
      where: {
        userId: userId,
        status: status,
      },
      include: {
        ong: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }


  findOne(id: string) {
    return this.prisma.campaign.findUnique({
      where: { id }, include: {
        category: true,
        ong: true,
        user: true,
        campaignDocuments: true,
        campaignMidias: true,
        campaignUpdates: true,
        campaignContributors: {
          include: {
            user: true
          }
        },
        campaignComments: true,
      },
    });
  }

  findCampaignByCategoryId(categoryId: string) {
    return this.prisma.campaign.findMany({
      where: { categoryId },
      include: {
        category: true,
        ong: true,
        user: true,
        campaignDocuments: true,
        campaignMidias: true,
        campaignUpdates: true,
        campaignContributors: true,
        campaignComments: true,
      },
    });
  }

  update(id: string, updateCampaignDto: UpdateCampaignDto) {

    const data: any = { ...updateCampaignDto };

    if (data.categoryId !== undefined) {
      data.categoryId = Number(data.categoryId);
    }
    if (data.ongId !== undefined) {
      data.ongId = Number(data.ongId);
    }
    if (data.userId !== undefined) {
      data.userId = Number(data.userId);
    }
    if (data.fundraisingGoal !== undefined) {
      data.fundraisingGoal = Number(data.fundraisingGoal);
    }
    data.status = data.status !== undefined ? String(data.status) : undefined;
    return this.prisma.campaign.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.campaign.delete({ where: { id } });
  }

  async findUrgentCampaignsSmart(userId?: string, limit = 10) {    
    
    if (!userId) {
      console.trace('ID não fornecido a findOne');
      throw new BadRequestException('ID da campanha é obrigatório');
    }

    const profile = userId
      ? await this.prisma.profile.findFirst({ where: { id: userId } })
      : null;

    const campaigns = await this.prisma.campaign.findMany({
      where: {
        isActivate: true,
        status: 'active',
        endDate: { gte: new Date() }, // ainda válidas
      },
      include: {
        category: true,
        ong: true,
        user: true,
        campaignDocuments: true,
        campaignMidias: true,
        campaignUpdates: true,
        campaignContributors: {
          include: {
            user: true  
          }
        },
        campaignComments: true,
      },
    });

    const scored = campaigns.map(c => ({
      ...c,
      urgencyScore: this.calculateUrgencyScore(c, profile),
    }));

    return scored
      .filter(c => c.urgencyScore >= 4)
      .sort((a, b) => b.urgencyScore - a.urgencyScore)
      .slice(0, limit);
  }



  calculateUrgencyScore(campaign: any, profile?: any): number {
    const now = new Date();
    const end = new Date(campaign.endDate);
    const daysLeft = (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

    const arrecadado = campaign.fundsRaised ?? 0;
    const meta = campaign.fundraisingGoal ?? 1;
    const porcentagem = arrecadado / meta;

    let score = 0;

    if (daysLeft <= 5) score += 2;
    if (porcentagem < 0.3) score += 2;
    if ((campaign.numberOfContributions ?? 0) <= 3) score += 1;

    const criticalTypes = ['saúde', 'emergência', 'acidente', 'infância'];
    if (criticalTypes.includes((campaign.campaignType ?? '').toLowerCase())) score += 2;

    if (profile?.location &&
      campaign.location &&
      campaign.location.toLowerCase().includes(profile.location.toLowerCase())) {
      score += 1;
    }

    return score;
  }
}