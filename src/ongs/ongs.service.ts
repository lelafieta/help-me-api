import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateOngDto } from './dto/create-ong.dto';
import { UpdateOngDto } from './dto/update-ong.dto';
import { Blog, Ong } from '@prisma/client';
import { AddOngMemberDto } from './dto/add-ong-member.dto';
import { CreateJoinRequestDto, RespondJoinRequestDto } from './dto/join-request.dto';

@Injectable()
export class OngsService {
  constructor(private prisma: PrismaService) { }

  async create(createOngDto: CreateOngDto) {
    return this.prisma.$transaction(async (tx) => {
      const ong = await tx.ong.create({
        data: {
          about: createOngDto.about,
          bio: createOngDto.bio,
          coverImageUrl: createOngDto.coverImageUrl,
          isVerified: createOngDto.isVerified ?? false,
          mission: createOngDto.mission,
          name: createOngDto.name,
          phoneNumber: createOngDto.phoneNumber,
          profileImageUrl: createOngDto.profileImageUrl,
          servicesNumber: 0,
          supportsNumber: 0,
          userId: createOngDto.userId ?? undefined,
          vision: createOngDto.vision,
          status: createOngDto.status ?? 'pending',
          email: createOngDto.email,
          website: createOngDto.website,
        },
      });

      // Se foi passado userId, criar membro ADMIN
      if (createOngDto.userId) {
        await tx.ongMember.create({
          data: {
            name: createOngDto.name ?? 'Administrador',
            role: 'ADMIN',
            ongId: ong.id,
            userId: createOngDto.userId,
            email: createOngDto.email,
            phone: createOngDto.phoneNumber,
          },
        });
      }

      return ong;
    });
  }

  // Criar pedido para entrar
  async createJoinRequest(
    userId: string | null,
    ongId: string,
    dto: CreateJoinRequestDto,
  ) {
    const alreadyExists = await this.prisma.ongJoinRequest.findFirst({
      where: { email: dto.email, ongId, status: 'PENDING' },
    });

    if (alreadyExists) {
      throw new BadRequestException('Já existe um pedido pendente para este e-mail.');
    }

    const joinRequest = await this.prisma.ongJoinRequest.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        role: dto.role,
        userId: userId ?? null,
        ongId,
      },
    });

    return {
      message: 'Pedido enviado com sucesso.',
      request: joinRequest,
    };
  }

  // Listar pedidos pendentes da ONG (ADMIN apenas)
  async listJoinRequests(ongId: string, adminUserId: string) {
    const isAdmin = await this.prisma.ongMember.findFirst({
      where: { userId: adminUserId, ongId, role: 'ADMIN' },
    });

    // if (!isAdmin) {
    //   throw new ForbiddenException('Apenas administradores podem ver os pedidos.');
    // }

    return this.prisma.ongJoinRequest.findMany({
      where: { ongId, status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Responder ao pedido
  async respondToJoinRequest(
    requestId: string,
    adminUserId: string,
    dto: RespondJoinRequestDto,
  ) {
    const request = await this.prisma.ongJoinRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Pedido não encontrado.');
    }

    const isAdmin = await this.prisma.ongMember.findFirst({
      where: { userId: adminUserId, ongId: request.ongId, role: 'ADMIN' },
    });

    // if (!isAdmin) {
    //   throw new ForbiddenException('Apenas administradores podem aceitar ou rejeitar.');
    // }

    if (dto.accept) {
      const member = await this.prisma.$transaction(async (tx) => {
        const created = await tx.ongMember.create({
          data: {
            name: request.name,
            email: request.email,
            phone: request.phone,
            role: request.role,
            userId: request.userId ?? undefined,
            ongId: request.ongId,
          },
        });

        await tx.ongJoinRequest.delete({ where: { id: requestId } });

        return created;
      });

      return {
        message: 'Pedido aceito e membro adicionado.',
        member,
      };
    } else {
      await this.prisma.ongJoinRequest.update({
        where: { id: requestId },
        data: { status: 'REJECTED' },
      });

      return {
        message: 'Pedido rejeitado.',
      };
    }
  }

  calculateBlogFeaturedScore(blog: Blog & { ong: Ong | null }): number {
    let score = 0;

    const now = new Date();
    const createdAt = new Date(blog.createdAt);
    const daysSinceCreated =
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

    // Criado há menos de 7 dias
    if (daysSinceCreated <= 7) score += 2;

    // ONG verificada
    if (blog.ong?.isVerified) score += 2;

    // Título ou descrição com palavras-chave
    const keywords = ['importante', 'urgente', 'destaque', 'apoio', 'alerta'];
    const title = blog.title?.toLowerCase() ?? '';
    const description = blog.description?.toLowerCase() ?? '';

    if (keywords.some((kw) => title.includes(kw) || description.includes(kw)))
      score += 1;

    return score;
  }

  async findPopularOngs(limit = 10) {
    const ongs = await this.prisma.ong.findMany({
      include: {
        campaigns: true,
        events: true,
        posts: {
          include: {
            user: true,
          }
        
        },
        user: true,
        impacts: {
          include: {
            user: true,
            medias: true,
          }
        },
        ongMember: {
          include: {
            user: true,
          }
        }
      },
    });

    const scored = ongs.map((ong) => ({
      ...ong,
      popularityScore: this.calculateOngPopularity(ong),
    }));

    return scored
      .filter((o) => o.popularityScore >= 2)
      .sort((a, b) => b.popularityScore - a.popularityScore)
      .slice(0, limit);
  }

  calculateOngPopularity(
    ong: Ong & { campaigns: any[]; events: any[]; posts: any[] },
  ): number {
    let score = 0;

    if (ong.isVerified) score += 2;
    if (ong.campaigns?.length > 0) score += 1;
    if (ong.events?.length > 0) score += 1;
    if (ong.posts?.length > 0) score += 1;
    if (ong.website) score += 1;
    if (ong.profileImageUrl) score += 1;

    return score;
  }

  findAll() {
    return this.prisma.ong.findMany({ include: { user: true } });
  }

  findOne(id: string) {
    return this.prisma.ong.findUnique({ where: { id }, include: { user: true } });
  }

  update(id: string, updateOngDto: UpdateOngDto) {
    return this.prisma.ong.update({ where: { id }, data: updateOngDto });
  }

  remove(id: string) {
    return this.prisma.ong.delete({ where: { id } });
  }
}
