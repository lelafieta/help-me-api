import { Module } from '@nestjs/common';
import { CampaignsController } from './campaigns.controller';
import { PrismaModule } from 'src/database/prisma.module';
import { CampaignsService } from './campaigns.service';

@Module({
  imports: [PrismaModule],
  controllers: [CampaignsController],
  providers: [CampaignsService],
})
export class CampaignsModule {}
