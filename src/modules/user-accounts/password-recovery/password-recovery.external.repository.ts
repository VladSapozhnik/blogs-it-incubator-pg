import { HttpStatus, Injectable } from '@nestjs/common';
import { DomainException } from '../../../core/exceptions/domain-exceptions';

@Injectable()
export class PasswordRecoveryExternalRepository {
  constructor() {}
  // async addPasswordRecoveryCode(
  //   passwordRecovery: PasswordRecoveryDocument,
  // ): Promise<string> {
  //   await passwordRecovery.save();
  //
  //   return passwordRecovery._id.toString();
  // }
  //
  // async findPasswordRecoveryByCode(
  //   recoveryCode: string,
  // ): Promise<PasswordRecoveryDocument> {
  //   const passwordRecovery: PasswordRecoveryDocument | null =
  //     await this.PasswordRecoveryModel.findOne({
  //       recoveryCode,
  //     });
  //
  //   if (!passwordRecovery) {
  //     throw new DomainException({
  //       status: HttpStatus.BAD_REQUEST,
  //       errorsMessages: [
  //         {
  //           message: 'Code is invalid',
  //           field: 'code',
  //         },
  //       ],
  //     });
  //   }
  //
  //   return passwordRecovery;
  // }
  //
  // async markAsUsedById(
  //   passwordRecovery: PasswordRecoveryDocument,
  // ): Promise<string> {
  //   await passwordRecovery.save();
  //
  //   return passwordRecovery._id.toString();
  // }
}
