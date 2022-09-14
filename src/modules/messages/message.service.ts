import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { classToPlain, plainToClass } from 'class-transformer';
import { User } from 'src/shared/models/user.entity';
import { Repository } from 'typeorm';
import { MessageDto } from './dtos/message.dto';
import { Message } from './message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) {}

  async setMessage(message: string, user: User) {
    const newMessage = await this.messageRepo.create({
      message,
      user,
    });

    await this.messageRepo.save(newMessage);
    delete newMessage.user;
    return newMessage;
  }

  async saveMessage(messageDto: MessageDto): Promise<Message> {
    const data = classToPlain(messageDto);
    const createdMessage = this.messageRepo.create({
      ...plainToClass(Message, data),
    });

    await this.messageRepo.save(createdMessage);
    delete createdMessage.chat;
    return createdMessage;
  }

  async getMessage(id: string, offset?: number, limit?: number): Promise<any> {
    const [items, count] = await this.messageRepo.findAndCount({
      where: { chat: { id } },
      order: {
        createdAt: 'DESC',
      },
      skip: offset,
      take: limit,
    });
    return {
      data: items,
      count,
    };
  }
}
