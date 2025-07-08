import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { PrismaModule } from 'src/database/prisma.module';
import { FavoritesService } from './favorites.service';

@Module({
  imports: [PrismaModule],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
