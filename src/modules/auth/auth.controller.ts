import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  async registration(@Body() user: CreateUserDto): Promise<void> {
    return this.authService.register(user);
  }

  @Post('login')
  async login(@Body() { login, password }: any) {
    const user = await this.authService.validateUser(login, password);
    return this.authService.login(user);
  }
}
