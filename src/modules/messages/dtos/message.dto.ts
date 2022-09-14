import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { Chat } from 'src/modules/chats/chat.entity';
import { User } from 'src/shared/models/user.entity';

export class MessageDto {
  @IsString()
  message: string;

  @ValidateNested()
  @Type(() => Chat)
  chat: Chat;

  @ValidateNested()
  @Type(() => Chat)
  user: User;
}
