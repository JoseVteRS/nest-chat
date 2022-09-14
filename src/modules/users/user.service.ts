import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { USER_NOT_FOUND } from 'src/shared/constants/user.constants';
import { User } from 'src/shared/models/user.entity';
import { Not, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async userSelf(user: User): Promise<User> {
    const findedUser = await this.userRepo.findOne({
      where: { email: user.email },
    });

    if (!findedUser) throw new UnauthorizedException(USER_NOT_FOUND);

    delete findedUser.passwordHash;
    return findedUser;
  }
  async getItems(myself: User): Promise<User[]> {
    return await this.userRepo.find({
      where: { id: Not(myself.id) },
    });
  }

  async get(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id: id } });
    if (!user) throw new BadRequestException(USER_NOT_FOUND);
    return user;
  }

  async update(id: string, userData: User): Promise<User> {
    const user = await this.get(id);
    return await this.userRepo.save({ ...user, ...userData });
  }
}
