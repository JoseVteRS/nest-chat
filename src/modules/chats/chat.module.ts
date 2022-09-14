import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExternalModule } from 'src/shared/modules/external/external.module';
import { AuthModule } from '../auth/auth.module';
import { MessagesModule } from '../messages/message.module';
import { UserModule } from '../users/user.module';
import { ChatsController } from './chat.controller';
import { Chat } from './chat.entity';
import { ChatService } from './chat.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat]),
    ConfigModule,
    UserModule,
    MessagesModule,
    AuthModule,
    ExternalModule,
  ],
  controllers: [ChatsController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
