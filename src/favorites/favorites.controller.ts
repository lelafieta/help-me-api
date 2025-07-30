import { Controller, Post, Delete, Get, Body, Param, Query, UseGuards,   Request, } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { Prisma } from '@prisma/client';

@Controller('favorites')
@UseGuards(AuthGuard('jwt'))
export class FavoritesController {
  constructor(private readonly favoriteService: FavoritesService) {}

  @Post()
  async addFavorite(    
    @Request() req: { user: { id: string } },
    @Body() createFavoriteDto: CreateFavoriteDto,
  ) {
    return this.favoriteService.favorite(req.user.id,createFavoriteDto);
  }

  @Delete()
  async removeFavorite(
    @Request() req: { user: { id: string } },
    @Body() createFavoriteDto: CreateFavoriteDto,
  ) {
    console.log('userId:', req.user.id);

    return this.favoriteService.unfavorite(req.user.id, createFavoriteDto);
  }

  @Get()
  async getFavorites(
    @Request() req: { user: { id: string } },
    @Query('itemType') itemType?: string,
  ) {
    return this.favoriteService.listFavorites(req.user.id, itemType);
  }

  @Get(':itemId')
  async checkFavorite(
    @GetUser('id') userId: string,
    @Param('itemId') itemId: string,
    @Query('itemType') itemType: string,
  ) {
    return this.favoriteService.isFavorited(userId, itemId, itemType);
  }
}
