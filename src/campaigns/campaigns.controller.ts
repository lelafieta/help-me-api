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
  Request,
  Req,
  Query,
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

import { extname } from 'path';
import { diskStorage } from 'multer';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { CreateUpdateCampaignDto } from './dto/create-update-campaign.dto';

@Controller('campaigns')
@UseGuards(AuthGuard('jwt'))
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) { }

  @HttpCode(200)
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: (req, file, cb) => {
          const ext = file.originalname.split('.').pop()?.toLowerCase() ?? '';

          if (['jpg', 'jpeg', 'png'].includes(ext)) {
            if (file.fieldname === 'cover')
              cb(null, './uploads/campaign_image_cover');
            else cb(null, './uploads/campaign_midias');
          } else if (
            ['mp4', 'mov', 'avi', 'jpg', 'jpeg', 'png'].includes(ext)
          ) {
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
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const cover = files.find((f) => f.fieldname === 'imageCoverUrl');
    const documents = files.filter((f) => f.fieldname === 'campaignDocuments');
    const midias = files.filter((f) => f.fieldname === 'campaignMidias');

    if (!cover || !documents.length || !midias.length) {
      throw new BadRequestException(
        `Capa, documentos e mídias são obrigatórios. Cover: ${!!cover}, Documents: ${!!documents}, Midias: ${!!midias}`,
      );
    }

    return this.campaignsService.create(dto, documents, midias, cover);
  }

  @HttpCode(200)
  @Get()
  findAll() {
    return this.campaignsService.findAll();
  }

  @HttpCode(200)
  @Get('user/:userId')
  findCampaignsByUserId(@Param('userId') userId: string) {
    return this.campaignsService.findCampaignsByUserId(userId);
  }

  @Get('/smart-urgent')
  getSmartUrgent(@Request() req: { user: { id: string } }) {
    return this.campaignsService.findUrgentCampaignsSmart(req.user.id);
  }

  @Get('my')
  getMyCampaignsByStatus(
    @Req() req: { user: { id: string } },
    @Query('status') status?: string,
    @Query('query') query?: string,
  ) {
    return this.campaignsService.findMyCampaignsByStatus(req.user.id,  {status, query});
  }

  // @Get('/my/:status')
  // getMyCampaignsByStatus(
  //   @Req() req: { user: { id: string } },
  //   @Param('status') status: string,
  // ) {
  //   return this.campaignsService.findMyCampaignsByStatus(req.user.id, status);
  // }


  @Get('/category/:id')
  findCampaignByCategoryId(@Param('id') id: string) {
    return this.campaignsService.findCampaignByCategoryId(id);
  }

  @Post('/updates')
  createUpdateCampaign(@Body() createUpdateCampaignDto: CreateUpdateCampaignDto) {
    return this.campaignsService.createUpdateCampaign(createUpdateCampaignDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campaignsService.findOne(id);
  }


  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCampaignDto: UpdateCampaignDto,
  ) {
    return this.campaignsService.update(id, updateCampaignDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campaignsService.remove(id);
  }
}
