import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { appSetup } from '../src/setup/app.setup';
import { deleteAllData } from './ helpers/delete-all-data';
import { errorMessageHelper } from './ helpers/error-message.helper';
import { constantHelper } from './ helpers/constant.helper';

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    appSetup(app);

    await app.init();

    await deleteAllData(app);

    await request(app.getHttpServer())
      .post('/users')
      .auth(constantHelper.superAdmin.user, constantHelper.superAdmin.pass)
      .send({ ...constantHelper.users[0] })
      .expect(HttpStatus.CREATED);

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        loginOrEmail: constantHelper.users[0].email,
        password: constantHelper.users[0].password,
      })
      .expect(HttpStatus.OK);

    const body = response.body as { accessToken: string };

    token = body.accessToken;
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('/auth/login (POST) should return access token for valid credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        loginOrEmail: constantHelper.users[0].email,
        password: constantHelper.users[0].password,
      })
      .expect(HttpStatus.OK);

    expect(response.body).toEqual({
      accessToken: expect.any(String) as string,
    });
  });

  it('/auth/login (POST) should return 401 for invalid password', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        loginOrEmail: constantHelper.users[0].email,
        password: constantHelper.users[1].password,
      })
      .expect(HttpStatus.UNAUTHORIZED);

    expect(response.body).toEqual(errorMessageHelper());
  });

  it('/auth/login (POST) should return 400 for empty login and password', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        loginOrEmail: '',
        password: '',
      })
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toEqual(errorMessageHelper(2));
  });

  it('/auth/profile (POST) should return user profile for valid token', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK);

    expect(response.body).toEqual({
      email: expect.any(String) as string,
      login: expect.any(String) as string,
      userId: expect.any(String) as string,
    });
  });

  it('/auth/profile (POST) should return 401 for invalid token', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${constantHelper.invalidToken}`)
      .expect(HttpStatus.UNAUTHORIZED);

    expect(response.body).toEqual(errorMessageHelper());
  });
});
