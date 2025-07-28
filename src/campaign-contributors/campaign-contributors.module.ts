import { Module } from '@nestjs/common';
import { CampaignContributorsController } from './campaign-contributors.controller';
import { CampaignContributorsService } from './campaign-contributors.service';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  controllers: [CampaignContributorsController],
  providers: [CampaignContributorsService],
  imports: [PrismaModule],
})
export class CampaignContributorsModule {}
