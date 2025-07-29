import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createProfileDto: Prisma.ProfileCreateInput) {
    return this.prisma.profile.create({ data: createProfileDto });
  }

  async findAll() {
    const profiles = await this.prisma.profile.findMany();

    return profiles.map((profile) => ({
      ...profile,
      donationQtd: profile.donationQtd?.toString() ?? '0',
      campaignQtd: profile.campaignQtd?.toString() ?? '0',
    }));
  }

  findOne(id: string) {
    return this.prisma.profile.findUnique({ where: { id } });
  }

  update(id: string, updateProfileDto: Prisma.ProfileUpdateInput) {
    return this.prisma.profile.update({
      where: { id },
      data: updateProfileDto,
    });
  }

  remove(id: string) {
    return this.prisma.profile.delete({ where: { id } });
  }
}
