import { User } from 'src/shared/models/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Chat } from '../chats/chat.entity';

@Entity({ name: 'messages' })
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  message: string;

  @ManyToOne(() => User, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  public user: User;

  @ManyToOne(() => Chat, {
    eager: false,
    cascade: true,
  })
  public chat: Chat;

  @Column('boolean', { default: false })
  was_edited: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  constructor(data: Message) {
    super();
  }
}
