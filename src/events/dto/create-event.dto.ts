import { IsOptional, IsString, IsInt, IsDateString, IsUrl } from 'class-validator';

export class CreateEventDto {
  @IsOptional()
  @IsInt({ message: 'O campo ongId deve ser um número inteiro.' })
  ongId?: number;

  @IsOptional()
  @IsInt({ message: 'O campo userId deve ser um número inteiro.' })
  userId?: number;

  @IsOptional()
  @IsString({ message: 'O título deve ser uma string.' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'A localização deve ser uma string.' })
  location?: string;

  @IsOptional()
  @IsString({ message: 'A descrição deve ser uma string.' })
  description?: string;

  @IsOptional()
  @IsUrl({}, { message: 'A URL da imagem de fundo deve ser válida.' })
  backgroundImageUrl?: string;

  @IsOptional()
  @IsDateString({}, { message: 'A data de início deve estar no formato ISO 8601.' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'A data de término deve estar no formato ISO 8601.' })
  endDate?: string;
}
