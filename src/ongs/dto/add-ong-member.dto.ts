import { IsEmail, IsEnum, IsOptional, IsString, IsUUID } from "class-validator";

export class AddOngMemberDto {
  @IsUUID()
  ongId: string;

  @IsUUID()
  userId: string;

  @IsString()
  name: string;

  @IsString()
  role: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
