import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request, { Response } from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { appSetup } from '../src/setup/app.setup';
import { deleteAllData } from './ helpers/delete-all-data';
import { type UsersMapper } from '../src/modules/user-accounts/users/mappers/users.mapper';
import { errorMessageHelper } from './ helpers/error-message.helper';
import { constantHelper } from './ helpers/constant.helper';
import { getAllForPaginationHelper } from './ helpers/get-all-for-pagination.helper';

describe('UserController (e2e)', () => {
  let app: INestApplication<App>;
  let createdUserId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    appSetup(app);

    await app.init();

    await deleteAllData(app);

    const userResponse = await request(app.getHttpServer())
      .post('/users')
      .auth(constantHelper.superAdmin.user, constantHelper.superAdmin.pass)
      .send({ ...constantHelper.users[0] })
      .expect(HttpStatus.CREATED);
    const userBody: UsersMapper = userResponse.body as UsersMapper;

    if (userBody.id) {
      createdUserId = userBody.id;
    }
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('/users (POST) should return 401 when non-admin tries to create a user', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .auth(
        constantHelper.invalidSuperAdmin.user,
        constantHelper.invalidSuperAdmin.pass,
      )
      .send({ ...constantHelper.users[1] })
      .expect(HttpStatus.UNAUTHORIZED);

    expect(response.body).toEqual(errorMessageHelper());
  });

  it('/users (POST) returns 400 when sending invalid user data', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .auth('admin', 'qwerty')
      .send({
        login: 'us',
        email: 'testing-mail.com',
        password: '',
      })
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toEqual(errorMessageHelper(3));
  });

  it('/users (GET) returns users with pagination and status 200', async () => {
    const response: Response = await request(app.getHttpServer())
      .get('/users')
      .auth(constantHelper.superAdmin.user, constantHelper.superAdmin.pass)
      .expect(HttpStatus.OK);

    expect(response.body).toEqual(getAllForPaginationHelper(response));
  });

  it('/users (GET) returns 401 when unauthorized super admin', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .auth(
        constantHelper.invalidSuperAdmin.user,
        constantHelper.invalidSuperAdmin.pass,
      )
      .expect(HttpStatus.UNAUTHORIZED);

    expect(response.body).toEqual(errorMessageHelper());
  });

  it('/users/id (DELETE) returns 401 when unauthorized user tries to delete', async () => {
    const response = await request(app.getHttpServer())
      .delete('/users/' + createdUserId)
      .auth(
        constantHelper.invalidSuperAdmin.user,
        constantHelper.invalidSuperAdmin.pass,
      )
      .expect(HttpStatus.UNAUTHORIZED);

    expect(response.body).toEqual(errorMessageHelper());
  });

  it('/users/id (DELETE returns 204 when super admin deletes an existing user)', async () => {
    await request(app.getHttpServer())
      .delete('/users/' + createdUserId)
      .auth(constantHelper.superAdmin.user, constantHelper.superAdmin.pass)
      .expect(HttpStatus.NO_CONTENT);
  });

  it('/users/id (DELETE) returns 404 when user does not exist', async () => {
    const response = await request(app.getHttpServer())
      .delete('/users/' + constantHelper.invalidId)
      .auth(constantHelper.superAdmin.user, constantHelper.superAdmin.pass)
      .expect(HttpStatus.NOT_FOUND);

    expect(response.body).toEqual(errorMessageHelper());
  });
});
