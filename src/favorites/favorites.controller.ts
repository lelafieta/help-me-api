import { Controller, Post, Delete, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
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
    @Body() createFavoriteDto: CreateFavoriteDto,
  ) {
    return this.favoriteService.favorite(createFavoriteDto);
  }

  @Delete()
  async removeFavorite(
    @GetUser('id') userId: string,
    @Body() body: { itemId: string; itemType: string },
  ) {
    return this.favoriteService.unfavorite(userId, body.itemId, body.itemType);
  }

  @Get()
  async getFavorites(
    @GetUser('id') userId: string,
    @Query('itemType') itemType?: string,
  ) {
    return this.favoriteService.listFavorites(userId, itemType);
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
