import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
      imports: [PrismaModule],
})
export class OngsModule {}
