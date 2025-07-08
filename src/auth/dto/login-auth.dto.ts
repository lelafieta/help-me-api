import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginAuthDto extends PartialType(CreateAuthDto) {
      @IsEmail()
      email: string;
    
      @IsString()
      @IsNotEmpty()
      @MinLength(6)
      password: string;
}