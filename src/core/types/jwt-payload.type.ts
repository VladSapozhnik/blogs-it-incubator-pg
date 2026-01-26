export type JwtPayload = {
  userId: string;
  deviceId?: string;
  iat?: number;
  exp?: number;
};

export type JwtRefreshPayload = {
  userId: string;
  deviceId: string;
  iat: number;
  exp: number;
};
