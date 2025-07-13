import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) { }
  async register(createAuthDto: CreateAuthDto) {
    const { name, email, password, phone } = createAuthDto;

    const existingUser = await this.prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✂️ Divide o nome completo
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || null;

    // 1️⃣ Cria o usuário
    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        phone,
        roleName: "user",
        password: hashedPassword,
      },
    });

    // 2️⃣ Cria o perfil com o mesmo ID e nomes separados
    await this.prisma.profile.create({
      data: {
        id: user.id,
        email: email,
        phoneNumber: phone,
        fullName: name,
        firstName: firstName,
        lastName: lastName,
        role: 'user',
        latitude: 0, // or provide a default/actual value
        longitude: 0, // or provide a default/actual value
      },
    });

    // JWT
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }



  async login(loginAuthDto: LoginAuthDto) {
    const { email } = loginAuthDto;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(loginAuthDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
