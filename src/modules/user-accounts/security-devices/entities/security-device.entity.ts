import {
  Column,
  Entity,
  Generated,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'security_devices' })
export class SecurityDevice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (u) => u.securityDevices)
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  @Generated('uuid')
  deviceId: string;

  @Column({ type: 'varchar' })
  ip: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'timestamp with time zone' })
  lastActiveDate: Date;

  @Column({ type: 'timestamp with time zone' })
  expiresAt: Date;

  static createInstance(
    userId: string,
    deviceId: string,
    ip: string,
    title: string,
    lastActiveDate: Date,
    expiresAt: Date,
  ) {
    const session = new this();

    session.userId = userId;
    session.deviceId = deviceId;
    session.ip = ip;
    session.title = title;
    session.lastActiveDate = lastActiveDate;
    session.expiresAt = expiresAt;

    return session;
  }

  updateSession(
    ip: string,
    title: string,
    lastActiveDate: Date,
    expiresAt: Date,
  ) {
    this.ip = ip;
    this.title = title;
    this.lastActiveDate = lastActiveDate;
    this.expiresAt = expiresAt;
  }
}
