import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import { classToPlain, plainToClass } from 'class-transformer';
import { Socket } from 'socket.io';
import { CHAT_HOT_FOUND } from 'src/shared/constants/chat.contansts';
import { User } from 'src/shared/models/user.entity';
import { SocketService } from 'src/shared/modules/external/services/socket.service';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { MessageDto } from '../messages/dtos/message.dto';
import { Message } from '../messages/message.entity';
import { MessageService } from '../messages/message.service';
import { UserService } from '../users/user.service';
import { Chat } from './chat.entity';
import { ChatDto } from './dtos/chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepo: Repository<Chat>,
    private readonly messagesService: MessageService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly socketService: SocketService,
  ) {}

  async getUserFromSocket(socket: Socket) {
    const user = await this.authService.getUserFromAuthenticationToken(
      socket.handshake.headers.authorization.replace('Bearer ', ''),
    );
    if (!user) {
      throw new WsException('Invalid credentials.');
    }
    return user;
  }

  async create(chatDto: ChatDto, user: User): Promise<Chat> {
    const data = classToPlain(chatDto);
    const users = [];

    if (data?.users?.length) {
      for (const { id } of data?.users) {
        const user = await this.userService.get(id);
        users.push(user);
      }
    }

    const createdChat = this.chatRepo.create({
      ...plainToClass(Chat, data),
      users,
      created_by: user,
    });
    await this.chatRepo.save(createdChat);

    if (createdChat) {
      this.socketService.socket.sockets.emit('chat_created', {
        event: 'chat_created',
        data: { user, newChat: createdChat },
      });
    }

    return createdChat;
  }

  async update(id: string, chatDto: ChatDto) {
    const findedChat = await this.chatRepo.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!findedChat) {
      throw new BadRequestException(CHAT_HOT_FOUND);
    }

    const data = classToPlain(chatDto);
    const updatedChat = await this.chatRepo.save({
      id,
      ...findedChat,
      ...plainToClass(Chat, data),
      users: findedChat.users.concat(chatDto.users),
    });

    return await this.chatRepo.findOne({ where: { id }, relations: ['users'] });
  }

  async deleteById(id: string) {
    const findedChat = await this.chatRepo.findOne({ where: { id } });

    if (!findedChat) {
      throw new BadRequestException(CHAT_HOT_FOUND);
    }

    return await this.chatRepo.delete(id);
  }

  async getItems(user: User): Promise<Chat[]> {
    const queryBuilder = this.chatRepo.createQueryBuilder('chat');
    const chats = await queryBuilder
      .innerJoin('chats_users_users', 'cu', 'chat.id = cu."chatsId"')
      .leftJoinAndSelect('chat.users', 'users')
      .leftJoinAndSelect('chat.last_message', 'last_message')
      .leftJoinAndSelect('chat.created_by', 'created_by')
      .where(`chat."createdById" = ${user.id} OR cu."usersId" = ${user.id}`)
      .getMany();

    return chats;
  }

  async get(id: string): Promise<Chat> {
    const chat = await this.chatRepo.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!chat) {
      throw new BadRequestException(CHAT_HOT_FOUND);
    }
    return chat;
  }

  async createMessage(
    id: string,
    messageDto: MessageDto,
    user: User,
  ): Promise<Message> {
    const chat = await this.chatRepo.findOne({ where: { id } });

    if (!chat) {
      throw new BadRequestException(CHAT_HOT_FOUND);
    } else {
      const userRepo = await this.userService.get(user.id);
      const createdMessage = {
        ...messageDto,
        chat,
        user: userRepo,
      };

      return await this.messagesService.saveMessage(createdMessage);
    }
  }

  async getMessages(
    id: string,
    offset: number,
    limit: number,
  ): Promise<Message[]> {
    const chat = await this.chatRepo.findOne({ where: { id } });

    if (!chat) {
      throw new BadRequestException(CHAT_HOT_FOUND);
    }

    return await this.messagesService.getMessage(id, offset, limit);
  }

  async savedMessage(message: string, user: User) {
    return await this.messagesService.setMessage(message, user);
  }
}
