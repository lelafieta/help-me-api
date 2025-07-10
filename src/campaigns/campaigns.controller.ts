
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { Prisma } from 'generated/prisma';
import { AnyFilesInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import { extname } from 'path';
import { Multer } from 'multer';
import { diskStorage } from 'multer';

@Controller('campaigns')
@UseGuards(AuthGuard('jwt'))
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) { }

  @HttpCode(200)
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: (req, file, cb) => {
          const ext = file.originalname.split('.').pop()?.toLowerCase();
          if (['jpg', 'jpeg', 'png'].includes(ext)) {
            if (file.fieldname === 'cover') cb(null, './uploads/campaign_image_cover');
            else cb(null, './uploads/campaign_midias');
          } else if (['mp4', 'mov', 'avi', 'jpg', 'jpeg', 'png'].includes(ext)) {
            cb(null, './uploads/campaign_midias');
          } else if (['pdf', 'docx', 'txt'].includes(ext)) {
            cb(null, './uploads/campaign_documents');
          } else {
            cb(new Error('Tipo de arquivo não suportado'), '');
          }
        },
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
    }),
  )

  @HttpCode(200)
  @Post()
  async createCampaign(
    @Body() dto: CreateCampaignDto,
    @UploadedFiles() files: Multer.File[],
  ) {
    const cover = files.find((f) => f.fieldname === 'imageCoverUrl');
    const documents = files.filter((f) => f.fieldname === 'campaignDocuments');
    const midias = files.filter((f) => f.fieldname === 'campaignMidias');

    if (!cover || !documents.length || !midias.length) {
      throw new BadRequestException('Capa, documentos e mídias são obrigatórios-' + cover + '-' + documents + '-' + midias + '');
    }

    return this.campaignsService.create(dto, documents, midias, cover);
  }


  @HttpCode(200)
  @Get()
  findAll() {
    return this.campaignsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campaignsService.findOne(Number(id));
  }

  @Get('/category/:id')
  findCampaignByCategoryId(@Param('id') id: string) {
    return this.campaignsService.findCampaignByCategoryId(Number(id));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCampaignDto: Prisma.CampaignUpdateInput,
  ) {
    return this.campaignsService.update(Number(id), updateCampaignDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campaignsService.remove(Number(id));
  }
}