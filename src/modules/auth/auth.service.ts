import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, genSalt, hash } from 'bcryptjs';
import { classToPlain, plainToClass } from 'class-transformer';
import {
  USER_ALREADY_REGISTERED,
  USER_NOT_FOUND,
  USER_WRONG_CREDENTIALS,
} from 'src/shared/constants/user.constants';
import { User } from 'src/shared/models/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(user: CreateUserDto) {
    const hasUser = await this.userRepo.findOne({
      where: {
        email: user.email,
      },
    });

    if (hasUser) throw new BadRequestException(USER_ALREADY_REGISTERED);

    const salt = await genSalt(10);
    const newUser = {
      ...user,
      email: user.email,
      passwordHash: await hash(user.password, salt),
    };
    const data = classToPlain(newUser);

    const createdUser = this.userRepo.create(plainToClass(User, data));
    await this.userRepo.save(createdUser);
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    delete user.passwordHash;
    return {
      access_token: await this.jwtService.signAsync(payload),
      user,
    };
  }

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { email: email } });

    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND);
    }

    const password = await compare(pass, user.passwordHash);

    if (!password) {
      throw new UnauthorizedException(USER_WRONG_CREDENTIALS);
    }

    return user;
  }

  public async getUserFromAuthenticationToken(token: string) {
    const payload = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_SECRET_KEY'),
    });

    if (payload.sub) {
      return this.userRepo.findOne({ where: { id: payload.id } });
    }
  }
}
