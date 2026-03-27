import { add } from 'date-fns/add';
import { HttpStatus } from '@nestjs/common';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import {
  Column,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('password_recoveries')
export class PasswordRecovery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.passwordRecoveries)
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  @Generated('uuid')
  recoveryCode: string;

  @Column({ type: 'timestamp with time zone' })
  expirationDate: Date;

  @Column({ type: 'boolean', default: false })
  isUsed: boolean;

  static createForUser(userId: string, recoveryCode: string) {
    const recovery = new this();
    recovery.userId = userId;
    recovery.recoveryCode = recoveryCode;
    recovery.expirationDate = add(new Date(), { minutes: 30 });
    recovery.isUsed = false;

    return recovery;
  }

  validateRecoveryCode(): void {
    if (this.isUsed || this.expirationDate < new Date()) {
      throw new DomainException({
        status: HttpStatus.BAD_REQUEST,
        errorsMessages: [
          {
            message: 'Code is invalid',
            field: 'code',
          },
        ],
      });
    }
  }

  markAsUsed(): void {
    this.isUsed = true;
  }
}
