import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateBlogDto {
  @IsOptional()
  @IsString({ message: "O campo 'description' deve ser uma string" })
  description?: string;

  @IsOptional()
  @IsString({ message: "O campo 'userId' deve ser uma string" })
  userId?: string;

  @IsOptional()
  @IsString({ message: "O campo 'ongId' deve ser uma string" })
  ongId?: string;

  @IsOptional()
  @IsString({ message: "O campo 'title' deve ser uma string" })
  title?: string;

  @IsOptional()
  @IsString({ message: "O campo 'image' deve ser uma string" })
  image?: string;
}