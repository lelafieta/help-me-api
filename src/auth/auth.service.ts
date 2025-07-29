import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
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
  ) {}
  async register(createAuthDto: CreateAuthDto) {
    const { firstName, lastName, email, password, phone } = createAuthDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 1️⃣ Cria o usuário
    const user = await this.prisma.user.create({
      data: {
        email,
        firstName: firstName,
        lastName: lastName,
        fullName: `${firstName} ${lastName}`,
        phone,
        roleName: 'user',
        avatarUrl: createAuthDto.avatarUrl,
        password: hashedPassword,
      },
    });

    // 2️⃣ Cria o perfil com o mesmo ID e nomes separados
    await this.prisma.profile.create({
      data: {
        id: user.id,
        email: email,
        phoneNumber: phone,
        fullName: `${firstName} ${lastName}`,
        firstName: firstName,
        lastName: lastName,
        role: 'user',
        avatarUrl: createAuthDto.avatarUrl,
        latitude: 0, // or provide a default/actual value
        longitude: 0, // or provide a default/actual value
      },
    });

    // JWT
    const payload = { email: user.email };
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

    const isPasswordValid = await bcrypt.compare(
      loginAuthDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  async getProfile(userId: string) {
    return this.prisma.profile.findUnique({
      where: { id: userId },
      include: { user: true },
    });
  }
}
