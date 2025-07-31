import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFile,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommunitiesService } from './communities.service';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '@nestjs/passport';

@Controller('communities')
@UseGuards(AuthGuard('jwt'))
export class CommunitiesController {
  constructor(private readonly communitiesService: CommunitiesService) {}

  // 🟢 Criação com upload de imagem opcional
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/community_images',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  create(
    @Body() createCommunityDto: CreateCommunityDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.communitiesService.create(createCommunityDto, image);
  }

  // 🔵 Buscar comunidades onde o usuário é dono ou membro
  @Get('/my')
  findAllByUser(@Request() req: { user: { id: string } }) {
    return this.communitiesService.findAllByUser(req.user.id);
  }

  // 🔍 Buscar comunidade por ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.communitiesService.findOne(id);
  }

  // ✏️ Atualizar comunidade
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommunityDto: UpdateCommunityDto,
  ) {
    return this.communitiesService.update(id, updateCommunityDto);
  }

  // ❌ Deletar comunidade
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.communitiesService.remove(id);
  }
}
