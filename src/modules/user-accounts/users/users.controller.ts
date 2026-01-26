import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersQueryParamsDto } from './dto/users-query-input.dto';
import { UsersMapper } from './mappers/users.mapper';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view.dto';
import { SuperAdminAuthGuard } from './guards/super-admin-auth.guard';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './application/usecases/create-user.usecase';
import { RemoveUserCommand } from './application/usecases/remove-user.usecase';
import { GetUsersQuery } from './application/queries/get-users.query';
import { GetUserByIdQuery } from './application/queries/get-user-by-id.query';

@Controller('users')
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @UseGuards(SuperAdminAuthGuard)
  async create(@Body() dto: CreateUserDto) {
    const id: string = await this.commandBus.execute<CreateUserCommand, string>(
      new CreateUserCommand(dto),
    );

    return this.queryBus.execute<GetUserByIdQuery, UsersMapper>(
      new GetUserByIdQuery(id),
    );
  }

  @Get()
  @UseGuards(SuperAdminAuthGuard)
  findAll(
    @Query() query: GetUsersQueryParamsDto,
  ): Promise<PaginatedViewDto<UsersMapper[]>> {
    return this.queryBus.execute<
      GetUsersQuery,
      PaginatedViewDto<UsersMapper[]>
    >(new GetUsersQuery(query));
  }

  @Delete(':id')
  @UseGuards(SuperAdminAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeUser(@Param('id') id: string) {
    await this.commandBus.execute<RemoveUserCommand, void>(
      new RemoveUserCommand(id),
    );
  }
}
