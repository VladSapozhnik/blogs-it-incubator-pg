import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SecurityDevicesQueryRepository } from '../../repositories/security-devices.query.repository';
import { SecurityDevicesMapper } from '../../mappers/security-devices.mapper';

export class GetSecurityDeviceByUserIdQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(GetSecurityDeviceByUserIdQuery)
export class GetDeviceSessionByUserIdQueryHandler implements IQueryHandler<GetSecurityDeviceByUserIdQuery> {
  constructor(
    private readonly securityDevicesQueryRepository: SecurityDevicesQueryRepository,
  ) {}

  async execute({
    userId,
  }: GetSecurityDeviceByUserIdQuery): Promise<SecurityDevicesMapper[]> {
    return this.securityDevicesQueryRepository.findDeviceSessionByUserId(
      userId,
    );
  }
}
