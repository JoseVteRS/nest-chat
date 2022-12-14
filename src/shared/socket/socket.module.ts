import { Module } from '@nestjs/common';
import { ChatModule } from 'src/modules/chats/chat.module';

@Module({
  imports: [ChatModule],
})
export class SocketModule {}
