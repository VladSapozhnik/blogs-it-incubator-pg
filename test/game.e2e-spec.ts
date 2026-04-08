import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { appSetup } from '../src/setup/app.setup';
import { deleteAllData } from './helpers/delete-all-data';
import { constantHelper } from './helpers/constant.helper';
import { errorMessageHelper } from './helpers/error-message.helper';

function getGameDate(
  numberOfPlayers: number = 1,
  user1Login: string,
  user2Login: string | null = null,
  finishGame: boolean = false,
) {
  if (numberOfPlayers === 1) {
    return {
      id: expect.any(String) as string,
      firstPlayerProgress: {
        answers: expect.any(Array) as [],
        player: {
          id: expect.any(String) as string,
          login: user1Login,
        },
        score: expect.any(Number) as number,
      },
      secondPlayerProgress: null,
      questions: null,
      status: 'PendingSecondPlayer',
      pairCreatedDate: expect.any(String) as string,
      startGameDate: null,
      finishGameDate: null,
    };
  }
  return {
    id: expect.any(String) as string,
    firstPlayerProgress: {
      answers: expect.any(Array) as [],
      player: {
        id: expect.any(String) as string,
        login: user1Login,
      },
      score: expect.any(Number) as number,
    },
    secondPlayerProgress: {
      answers: expect.any(Array) as [],
      player: {
        id: expect.any(String) as string,
        login: user2Login,
      },
      score: expect.any(Number) as number,
    },
    questions: expect.any(Array) as [],
    status: 'PendingSecondPlayer',
    pairCreatedDate: expect.any(String) as string,
    startGameDate: expect.any(String) as string,
    finishGameDate: finishGame ? (expect.any(String) as string) : null,
  };
}

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;
  let token: string;
  let tokenUser2: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    appSetup(app);
    await app.init();
  });

  beforeEach(async () => {
    await deleteAllData(app);

    await request(app.getHttpServer())
      .post('/sa/users')
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

    await request(app.getHttpServer())
      .post('/sa/users')
      .auth(constantHelper.superAdmin.user, constantHelper.superAdmin.pass)
      .send({ ...constantHelper.users[1] })
      .expect(HttpStatus.CREATED);

    const responseUser2 = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        loginOrEmail: constantHelper.users[1].email,
        password: constantHelper.users[1].password,
      })
      .expect(HttpStatus.OK);

    const body = response.body as { accessToken: string };
    const bodyUser2 = responseUser2.body as { accessToken: string };

    token = body.accessToken;
    tokenUser2 = bodyUser2.accessToken;

    //QUESTION
    for (const item of constantHelper.questions) {
      await request(app.getHttpServer())
        .post('/sa/quiz/questions')
        .auth(constantHelper.superAdmin.user, constantHelper.superAdmin.pass)
        .send(item)
        .expect(HttpStatus.CREATED);
    }
    // await Promise.all(
    //   constantHelper.questions.map((item) =>
    //     request(app.getHttpServer())
    //       .post('/sa/quiz/questions')
    //       .send(item)
    //       .expect(HttpStatus.CREATED),
    //   ),
    // );
  });

  afterAll(async () => {
    await app.close();
  });

  it('pair-game-quiz/pairs/connection (POST) should return', async () => {
    const response = await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/connection')
      .set('Authorization', `Bearer ${constantHelper.invalidToken}`)
      .expect(HttpStatus.UNAUTHORIZED);

    expect(response.body).toEqual(errorMessageHelper());
  });

  it('pair-game-quiz/pairs/connection (POST) should return', async () => {
    const response = await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/connection')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK);

    expect(response.body).toEqual(
      getGameDate(1, constantHelper.users[0].login),
    );
  });

  it('pair-game-quiz/pairs/connection (POST) should return', async () => {
    const response = await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/connection')
      .set('Authorization', `Bearer ${tokenUser2}`)
      .expect(HttpStatus.OK);

    // expect(response.body).toEqual(
    //   getGameDate(
    //     2,
    //     constantHelper.users[0].login,
    //     constantHelper.users[1].login,
    //   ),
    // );
  });

  // it('/auth/login (POST) should return access token for valid credentials', async () => {
  //   const response = await request(app.getHttpServer())
  //     .post('/auth/login')
  //     .send({
  //       loginOrEmail: constantHelper.users[0].email,
  //       password: constantHelper.users[0].password,
  //     })
  //     .expect(HttpStatus.OK);
  //
  //   expect(response.body).toEqual({
  //     accessToken: expect.any(String) as string,
  //   });
  // });
  //
  // it('/auth/login (POST) should return 401 for invalid password', async () => {
  //   const response = await request(app.getHttpServer())
  //     .post('/auth/login')
  //     .send({
  //       loginOrEmail: constantHelper.users[0].email,
  //       password: constantHelper.users[1].password,
  //     })
  //     .expect(HttpStatus.UNAUTHORIZED);
  //
  //   expect(response.body).toEqual(errorMessageHelper());
  // });
  //
  // it('/auth/login (POST) should return 400 for empty login and password', async () => {
  //   const response = await request(app.getHttpServer())
  //     .post('/auth/login')
  //     .send({
  //       loginOrEmail: '',
  //       password: '',
  //     })
  //     .expect(HttpStatus.BAD_REQUEST);
  //
  //   expect(response.body).toEqual(errorMessageHelper(2));
  // });
  //
  // it('/auth/profile (POST) should return user profile for valid token', async () => {
  //   const response = await request(app.getHttpServer())
  //     .get('/auth/me')
  //     .set('Authorization', `Bearer ${token}`)
  //     .expect(HttpStatus.OK);
  //
  //   expect(response.body).toEqual({
  //     email: expect.any(String) as string,
  //     login: expect.any(String) as string,
  //     userId: expect.any(String) as string,
  //   });
  // });
  //
  // it('/auth/profile (POST) should return 401 for invalid token', async () => {
  //   const response = await request(app.getHttpServer())
  //     .get('/auth/me')
  //     .set('Authorization', `Bearer ${constantHelper.invalidToken}`)
  //     .expect(HttpStatus.UNAUTHORIZED);
  //
  //   expect(response.body).toEqual(errorMessageHelper());
  // });
});
