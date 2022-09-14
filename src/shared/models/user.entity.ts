import { Chat } from 'src/modules/chats/chat.entity';
import { Message } from 'src/modules/messages/message.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  first_name: string;

  @Column('text')
  last_name: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text')
  passwordHash: string;

  @OneToMany(() => Message, (message: Message) => message.user)
  public message: Message;

  @OneToMany(() => Chat, (chat: Chat) => chat.created_by)
  public createdChats: Chat[];

  @ManyToMany((type) => Chat, (chat: Chat) => chat.users)
  public chats: Chat[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  constructor(data: User) {
    super();
  }
}
