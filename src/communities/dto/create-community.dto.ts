import {
  IsString,
  IsOptional,
  IsUrl,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateCommunityDto {
  @IsString({ message: 'O nome da comunidade deve ser um texto.' })
  @MinLength(3, { message: 'O nome deve ter no mínimo 3 caracteres.' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres.' })
  name: string;

  @IsOptional()
  @IsString({ message: 'A descrição deve ser um texto.' })
  @MaxLength(300, { message: 'A descrição deve ter no máximo 300 caracteres.' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'A localização deve ser um texto.' })
  @MaxLength(100, {
    message: 'A localização deve ter no máximo 100 caracteres.',
  })
  location?: string;

  @IsOptional()
  @IsUrl({}, { message: 'A URL da imagem é inválida.' })
  imageUrl?: string;

  @IsString({ message: 'O ID do proprietário deve ser um número inteiro.' })
  ownerId: string;
}
