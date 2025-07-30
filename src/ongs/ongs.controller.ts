import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OngsService } from './ongs.service';
import { CreateOngDto } from './dto/create-ong.dto';
import { UpdateOngDto } from './dto/update-ong.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateJoinRequestDto, RespondJoinRequestDto } from './dto/join-request.dto';

@Controller('ongs')
@UseGuards(AuthGuard('jwt'))
export class OngsController {
  constructor(private readonly ongsService: OngsService) { }

  @Post()
  create(@Body() createOngDto: CreateOngDto) {
    return this.ongsService.create(createOngDto);
  }

  @Get('popular')
  getPopularOngs() {
    return this.ongsService.findPopularOngs();
  }

  // Enviar pedido para entrar na ONG
  @Post(':id/join-request')
  async requestToJoinOng(
    @Param('id') ongId: string,
    @Body() dto: CreateJoinRequestDto,
    @Request() req: { user: { id: string } },
  ) {
    const userId = req.user?.id ?? null;
    return this.ongsService.createJoinRequest(userId, ongId, dto);
  }

  // Listar pedidos pendentes
  @Get(':id/requests')
  async listJoinRequests(
    @Param('id') ongId: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.ongsService.listJoinRequests(ongId, req.user.id);
  }

  // Responder ao pedido (aceitar/rejeitar)
  @Patch('/requests/:requestId/respond')
  async respondToJoinRequest(
    @Param('requestId') requestId: string,
    @Body() dto: RespondJoinRequestDto,
    @Request() req: { user },
  ) {
    return this.ongsService.respondToJoinRequest(requestId, req.user.id, dto);
  }


  @Get()
  findAll() {
    return this.ongsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ongsService.findOne(id);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOngDto: UpdateOngDto) {
    return this.ongsService.update(id, updateOngDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ongsService.remove(id);
  }
}
