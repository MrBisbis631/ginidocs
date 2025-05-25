import { Controller, Post, Body, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { RegisterDto } from './dto/register.dto';
import { User } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body);
    return this.authService.login(user);
  }

  @Public()
  @Post('register')
  async signUp(@Body() body: RegisterDto) {
    const user = await this.authService.register(body);
    return this.authService.login(user);
  }

  @Public()
  @Post('refresh')
  refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  @Get('profile')
  getProfile(@Request() req: { user: Omit<User, 'password'> }) {
    return {
      ...req.user,
      password: undefined,
    };
  }
}
