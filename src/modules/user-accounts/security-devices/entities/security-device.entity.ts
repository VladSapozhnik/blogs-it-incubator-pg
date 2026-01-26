export class SecurityDevice {
  userId: string;

  deviceId: string;

  ip: string;

  title: string;

  lastActiveDate: Date;

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
