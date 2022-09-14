import { IsOptional, IsString } from 'class-validator';
import { User } from 'src/shared/models/user.entity';

export class ChatDto {
  @IsString()
  title: string;

  @IsOptional()
  users: User[];
}
