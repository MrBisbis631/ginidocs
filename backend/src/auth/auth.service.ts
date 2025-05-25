import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

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
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
