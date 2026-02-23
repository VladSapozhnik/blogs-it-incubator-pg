import { CreateUserDto } from '../dto/create-user.dto';
import { HttpStatus } from '@nestjs/common';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class EmailConfirmation {
  confirmationCode?: string;
  expirationDate: Date;
  isConfirmed?: boolean;
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  login: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', select: false })
  password: string;

  @Column({ type: 'uuid' })
  @Generated('uuid')
  confirmationCode: string;

  @Column({ type: 'timestamp with time zone' })
  expirationDate: Date;

  @Column({ type: 'boolean', default: false })
  isConfirmed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  static createInstance(
    dto: CreateUserDto,
    hash: string,
    emailConfirmation: EmailConfirmation,
  ): User {
    const user = new this();

    user.login = dto.login;
    user.password = hash;
    user.email = dto.email;
    if (emailConfirmation.confirmationCode) {
      user.confirmationCode = emailConfirmation.confirmationCode;
    }
    user.expirationDate = emailConfirmation.expirationDate;

    user.isConfirmed = emailConfirmation?.isConfirmed ?? false;

    return user;
  }

  setPassword(newHash: string): void {
    this.password = newHash;
  }

  resendEmail(code: string, expirationDate: Date) {
    this.confirmationCode = code;
    this.expirationDate = expirationDate;
    this.isConfirmed = false;
  }

  confirmEmail() {
    if (this.isConfirmed) {
      throw new DomainException({
        status: HttpStatus.BAD_REQUEST,
        errorsMessages: [
          {
            message: 'Email already confirmed',
            field: 'User',
          },
        ],
      });
    }
    if (this.expirationDate < new Date()) {
      throw new DomainException({
        status: HttpStatus.BAD_REQUEST,
        errorsMessages: [
          {
            message: 'Confirmation code expired',
            field: 'code',
          },
        ],
      });
    }

    this.isConfirmed = true;
  }
}
