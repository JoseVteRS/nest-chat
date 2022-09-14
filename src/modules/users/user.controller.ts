import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { User } from 'src/shared/models/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('self')
  userSelf(@Req() req: any): Promise<User> {
    return this.userService.userSelf(req.user);
  }
}
