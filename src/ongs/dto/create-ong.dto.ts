import {
  IsOptional,
  IsString,
  IsBoolean,
  IsInt,
  IsUrl,
  IsEmail
} from 'class-validator';

export class CreateOngDto {
  @IsOptional()
  @IsString({ message: 'O campo "about" deve ser um texto.' })
  about?: string;

  @IsOptional()
  @IsString({ message: 'O campo "bio" deve ser um texto.' })
  bio?: string;

  @IsOptional()
  @IsUrl({}, { message: 'A URL da imagem de capa é inválida.' })
  coverImageUrl?: string;

  @IsOptional()
  @IsBoolean({ message: 'O campo "isVerified" deve ser verdadeiro ou falso.' })
  isVerified?: boolean;

  @IsOptional()
  @IsString({ message: 'O campo "mission" deve ser um texto.' })
  mission?: string;

  @IsOptional()
  @IsString({ message: 'O nome deve ser um texto.' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'O número de telefone deve ser um texto.' })
  phoneNumber?: string;

  @IsOptional()
  @IsUrl({}, { message: 'A URL da imagem de perfil é inválida.' })
  profileImageUrl?: string;

  @IsOptional()
  @IsInt({ message: 'O campo "userId" deve ser um número inteiro.' })
  userId?: number;

  @IsOptional()
  @IsString({ message: 'O campo "vision" deve ser um texto.' })
  vision?: string;

  @IsOptional()
  @IsString({ message: 'O status deve ser um texto.' })
  status?: string;

  @IsOptional()
  @IsEmail({}, { message: 'O campo "email" deve conter um email válido.' })
  email?: string;

  @IsOptional()
  @IsUrl({}, { message: 'A URL do website é inválida.' })
  website?: string;
}
