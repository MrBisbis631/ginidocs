import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import ms, { StringValue } from 'ms';

@Injectable()
export class AuthService {
  jwtAccessExpiresIn: number;
  jwtRefreshExpiresIn: number;
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtAccessExpiresIn = ms(
      configService.get<string>('JWT_EXPIRES_IN_ACCESS', '1h') as StringValue,
    );

    this.jwtRefreshExpiresIn = ms(
      configService.get<string>('JWT_EXPIRES_IN_REFRESH', '48h') as StringValue,
    );
  }

  async validateUser({ email, password }: LoginDto): Promise<User> {
    const user = await this.usersRepo.findOne({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async register(userData: RegisterDto) {
    const doesUserExists = await this.usersRepo.count({
      where: { email: userData.email },
      take: 1,
    });

    if (doesUserExists) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(
      userData.password,
      this.configService.get<number>('BCRYPT_SALT_ROUNDS', 14),
    );

    const user = this.usersRepo.create({
      ...userData,
      password: hashedPassword,
    });

    return this.usersRepo.save(user);
  }

  login(user: User) {
    const payload: JwtPayloadDto = { email: user.email, sub: user.id };

    const tokens = this.getJwtTokens(payload);

    return tokens;
  }

  refresh(refreshToken: string) {
    try {
      const payload: JwtPayloadDto = this.jwtService.verify(refreshToken);

      return this.getJwtTokens(payload);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private getJwtTokens(payload: JwtPayloadDto): {
    access_token: string;
    refresh_token: string;
    access_interval: number;
    refresh_interval: number;
  } {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_EXPIRES_IN_ACCESS'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_EXPIRES_IN_REFRESH'),
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      access_interval: this.jwtAccessExpiresIn,
      refresh_interval: this.jwtRefreshExpiresIn,
    };
  }
}
