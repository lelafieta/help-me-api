import {
  IsString,
  IsOptional,
  IsUrl,
  IsDateString,
  IsInt,
  IsNumberString,
  MaxLength,
} from 'class-validator';

export class CreateEventDto {
  @IsOptional()
  @IsString({ message: 'O título deve ser um texto.' })
  @MaxLength(100, { message: 'O título pode ter no máximo 100 caracteres.' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'A localização deve ser um texto.' })
  @MaxLength(150, {
    message: 'A localização pode ter no máximo 150 caracteres.',
  })
  location?: string;

  @IsOptional()
  @IsNumberString({}, { message: 'A latitude deve ser numérica.' })
  latitude?: string;

  @IsOptional()
  @IsNumberString({}, { message: 'A longitude deve ser numérica.' })
  longitude?: string;

  @IsOptional()
  @IsString({ message: 'A descrição deve ser um texto.' })
  @MaxLength(500, { message: 'A descrição pode ter no máximo 500 caracteres.' })
  description?: string;

  @IsOptional()
  @IsUrl({}, { message: 'A URL da imagem é inválida.' })
  backgroundImageUrl?: string;

  @IsOptional()
  @IsDateString({}, { message: 'A data de início deve estar no formato ISO.' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'A data de fim deve estar no formato ISO.' })
  endDate?: string;

  @IsOptional()
  @IsString({ message: 'O ID da ONG deve ser um número.' })
  ongId?: string;

  @IsOptional()
  @IsString({ message: 'O ID do usuário deve ser um número.' })
  userId?: string;

  @IsOptional()
  // @IsString({ message: 'O ID da comunidade é obrigatório e deve ser um número.' })
  communityId?: string;
}
