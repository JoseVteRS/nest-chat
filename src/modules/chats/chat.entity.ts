import { User } from 'src/shared/models/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Message } from '../messages/message.entity';

@Entity({ name: 'chats' })
export class Chat extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  title: string;

  @Column('int', { default: 0 })
  unread_messages_count: number;

  @ManyToOne(() => User, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  public created_by: User;

  @ManyToMany((type) => User, (user: User) => user.chats, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  users: User[];

  @OneToMany(() => Message, (message: Message) => message.chat)
  public messages: Message[];

  @OneToOne(() => Message, (message: Message) => message.chat)
  public last_message: Message;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  constructor(data: Chat) {
    super();
  }
}
