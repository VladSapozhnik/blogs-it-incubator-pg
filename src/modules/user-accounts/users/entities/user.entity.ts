import { CreateUserDto } from '../dto/create-user.dto';
import { HttpStatus } from '@nestjs/common';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PasswordRecovery } from '../../password-recovery/entities/password-recovery.entity';
import { SecurityDevice } from '../../security-devices/entities/security-device.entity';

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

  @OneToMany(() => PasswordRecovery, (recovery) => recovery.user)
  passwordRecoveries: PasswordRecovery[];

  @OneToMany(() => SecurityDevice, (securityDevice) => securityDevice.user)
  securityDevices: SecurityDevice[];

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
    if (this.isConfirmed) {
      throw new DomainException({
        status: HttpStatus.BAD_REQUEST,
        errorsMessages: [
          {
            message: 'Email already confirmed',
            field: 'email',
          },
        ],
      });
    }

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
            field: 'code',
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
