import { Module } from '@nestjs/common';
import { SocketService } from './services/socket.service';

@Module({
  providers: [SocketService],
  exports: [SocketService],
})
export class ExternalModule {}
