import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PaginationParams } from 'src/shared/models/pagination';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { MessageDto } from '../messages/dtos/message.dto';
import { Message } from '../messages/message.entity';
import { Chat } from './chat.entity';
import { ChatService } from './chat.service';
import { ChatDto } from './dtos/chat.dto';

@Controller('chats')
export class ChatsController {
  constructor(private chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('')
  @HttpCode(201)
  create(@Req() req: any, @Body() chatDto: ChatDto): Promise<Chat> {
    return this.chatService.create(chatDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @HttpCode(200)
  get(@Param('id') id: string): Promise<Chat> {
    return this.chatService.get(id);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Patch(':id')
  update(@Param('id') id: string, @Body() chat: ChatDto) {
    return this.chatService.update(id, chat);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(200)
  async delete(@Param('id') id: string) {
    return this.chatService.deleteById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  @HttpCode(200)
  getItems(@Req() req: any): Promise<Chat[]> {
    return this.chatService.getItems(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post(':id/messages')
  @HttpCode(201)
  sendMessage(
    @Req() req: any,
    @Param('id') id: string,
    @Body() messageDto: MessageDto,
  ): Promise<Message> {
    return this.chatService.createMessage(id, messageDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Get(':id/messages')
  @HttpCode(200)
  getMessages(
    @Query() { offset, limit }: PaginationParams,
    @Param('id') id: string,
  ): Promise<Message[]> {
    return this.chatService.getMessages(id, offset, limit);
  }
}
