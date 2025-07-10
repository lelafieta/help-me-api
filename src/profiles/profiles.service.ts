import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService){}


  create(createProfileDto: Prisma.ProfileCreateInput) {
    return this.prisma.profile.create({ data: createProfileDto });
  }

  async findAll() {
    const profiles = await this.prisma.profile.findMany();

    return profiles.map((profile) => ({
      ...profile,
      donationQtd: profile.donationQtd?.toString() ?? "0",
      campaignQtd: profile.campaignQtd?.toString() ?? "0",
    }));
  }

  findOne(id: number) {
    return `This action returns a #${id} profile`;
  }

  update(id: number, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
