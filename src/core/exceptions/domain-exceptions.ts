import { ErrorMessageType } from '../types/error-message.type';

export class DomainException extends Error {
  readonly status: number;
  readonly errorsMessages: ErrorMessageType[];

  constructor(params: { status: number; errorsMessages: ErrorMessageType[] }) {
    super('Domain exception');
    Object.setPrototypeOf(this, new.target.prototype);
    this.status = params.status;
    this.errorsMessages = params.errorsMessages;
  }
}
