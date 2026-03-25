import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('account_activation_tokens')
@Index('uq_account_activation_tokens_token', ['token'], { unique: true })
export class AccountActivationToken {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    unsigned: true,
  })
  id: string;

  @Column({
    name: 'user_id',
    type: 'bigint',
    unsigned: true,
  })
  userId: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  token: string;

  @Column({
    name: 'expires_at',
    type: 'datetime',
  })
  expiresAt: Date;

  @Column({
    name: 'used_at',
    type: 'datetime',
    nullable: true,
  })
  usedAt?: Date | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.accountActivationTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
