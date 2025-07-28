import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { PrismaService } from './database/prisma.service';
import { EventsModule } from './events/events.module';
import { OngsModule } from './ongs/ongs.module';
import { CategoriesModule } from './categories/categories.module';
import { CommunitiesModule } from './communities/communities.module';
import { FavoritesModule } from './favorites/favorites.module';
import { BlogsModule } from './blogs/blogs.module';
import { PrismaModule } from './database/prisma.module';
import { ProfilesModule } from './profiles/profiles.module';
import { FeedsModule } from './feeds/feeds.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CampaignContributorsModule } from './campaign-contributors/campaign-contributors.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads', // agora acessa via http://localhost:3000/uploads/...
    }),
    AuthModule,
    CampaignsModule,
    EventsModule,
    OngsModule,
    CategoriesModule,
    CommunitiesModule,
    FavoritesModule,
    BlogsModule,
    PrismaModule,
    ProfilesModule,
    FeedsModule,
    CampaignContributorsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
