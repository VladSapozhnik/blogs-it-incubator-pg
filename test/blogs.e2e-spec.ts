import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request, { Response } from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { appSetup } from '../src/setup/app.setup';
import { deleteAllData } from './ helpers/delete-all-data';
import { errorMessageHelper } from './ helpers/error-message.helper';
import { constantHelper } from './ helpers/constant.helper';
import { createStringHelper } from './ helpers/create-string.helper';
import { BlogsMapper } from '../src/modules/bloggers-platform/blogs/mappers/blogs.mapper';
import { getAllForPaginationHelper } from './ helpers/get-all-for-pagination.helper';

describe('BlogsController (e2e)', () => {
  let app: INestApplication<App>;
  let blogId: string;

  const responseBlogExample = {
    id: expect.any(String) as string,
    name: expect.any(String) as string,
    description: expect.any(String) as string,
    websiteUrl: expect.any(String) as string,
    createdAt: expect.any(String) as string,
    isMembership: expect.any(Boolean) as boolean,
  };

  beforeEach(async () => {});

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    appSetup(app);

    await app.init();

    await deleteAllData(app);

    const response = await request(app.getHttpServer())
      .post('/blogs')
      .auth(constantHelper.superAdmin.user, constantHelper.superAdmin.pass)
      .send({
        name: createStringHelper(13),
        description: createStringHelper(11),
        websiteUrl:
          'https://-Pd5J4cMUMlF3DsJSV0.dFT3ccLBO7qhh3Ck2ISs4tHhqLv1vy0p2PbcVzazIhv0UmLRMRIxhRKVZY.YtEH.E_Ct9FU5',
      })
      .expect(HttpStatus.CREATED);

    const body: BlogsMapper = response.body as BlogsMapper;

    if (body.id) {
      blogId = body.id;
    }
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('GET /blogs', () => {
    it('/blogs (GET) should return all blogs with correct pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/blogs')
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(getAllForPaginationHelper(response));
    });
  });

  describe('POST /blogs create blog', () => {
    it('/blogs (POST) should return 400 when creating a blog with empty name, description, and websiteUrl', async () => {
      const response = await request(app.getHttpServer())
        .post('/blogs')
        .auth(constantHelper.superAdmin.user, constantHelper.superAdmin.pass)
        .send({
          name: '',
          description: '',
          websiteUrl: '',
        })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toEqual(errorMessageHelper(3));
    });

    it('/blogs (POST) should return 400 when creating a blog with name, description, or websiteUrl exceeding max length', async () => {
      const response = await request(app.getHttpServer())
        .post('/blogs')
        .auth(constantHelper.superAdmin.user, constantHelper.superAdmin.pass)
        .send({
          name: createStringHelper(16),
          description: createStringHelper(501),
          websiteUrl: createStringHelper(101),
        })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toEqual(errorMessageHelper(3));
    });

    it('/blogs (POST) should return 401 when using invalid super admin credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/blogs')
        .auth(
          constantHelper.invalidSuperAdmin.user,
          constantHelper.invalidSuperAdmin.pass,
        )
        .send({
          name: createStringHelper(13),
          description: createStringHelper(11),
          websiteUrl: createStringHelper(11),
        })
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body).toEqual(errorMessageHelper());
    });

    it('/blogs (POST) should create a blog successfully even with unusual but valid websiteUrl', async () => {
      const response = await request(app.getHttpServer())
        .post('/blogs')
        .auth(constantHelper.superAdmin.user, constantHelper.superAdmin.pass)
        .send({
          name: createStringHelper(13),
          description: createStringHelper(11),
          websiteUrl:
            'https://-Pd5J4cMUMlF3DsJSV0.dFT3ccLBO7qhh3Ck2ISs4tHhqLv1vy0p2PbcVzazIhv0UmLRMRIxhRKVZY.YtEH.E_Ct9FU5',
        })
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual(responseBlogExample);
    });
  });

  describe('GET /blogs get one blog', () => {
    it('/blogs (GET) should return a blog by ID when the blog exists', async () => {
      const response = await request(app.getHttpServer())
        .get('/blogs/' + blogId)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(responseBlogExample);
    });

    it('/blogs (GET) should return 404 when trying to get a blog with a non-existing ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/blogs/' + constantHelper.invalidId)
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toEqual(errorMessageHelper());
    });
  });

  describe('PUT /blogs update blog', () => {
    it('/blogs (PUT) should return 400 when updating a blog with empty name, description, and websiteUrl', async () => {
      const response = await request(app.getHttpServer())
        .put('/blogs/' + blogId)
        .auth(constantHelper.superAdmin.user, constantHelper.superAdmin.pass)
        .send({
          name: '',
          description: '',
          websiteUrl: '',
        })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toEqual(errorMessageHelper(3));
    });

    it('/blogs (PUT) should return 400 when updating a blog with fields exceeding max length or invalid URL', async () => {
      const response = await request(app.getHttpServer())
        .put('/blogs/' + blogId)
        .auth(constantHelper.superAdmin.user, constantHelper.superAdmin.pass)
        .send({
          name: createStringHelper(16),
          description: createStringHelper(502),
          websiteUrl: 'https:/',
        })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toEqual(errorMessageHelper(3));
    });

    it('/blogs (PUT) should return 401 when updating a blog with invalid super admin credentials', async () => {
      const response = await request(app.getHttpServer())
        .put('/blogs/' + blogId)
        .auth(
          constantHelper.invalidSuperAdmin.user,
          constantHelper.invalidSuperAdmin.pass,
        )
        .send({
          name: createStringHelper(10),
          description: createStringHelper(8),
          websiteUrl:
            'https://-Pd5J4cMUMlF3DsJSV0.dFT3ccLBO7qhh3Ck2ISs4tHhqLv1vy0p2PbcVzazIhRIxhRKVZY.YtEH.E_Ct9FU5',
        })
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body).toEqual(errorMessageHelper());
    });

    it('/blogs (PUT) should return 404 when updating a blog that does not exist', async () => {
      const response = await request(app.getHttpServer())
        .put('/blogs/' + constantHelper.invalidId)
        .auth(constantHelper.superAdmin.user, constantHelper.superAdmin.pass)
        .send({
          name: createStringHelper(10),
          description: createStringHelper(8),
          websiteUrl:
            'https://-Pd5J4cMUMlF3DsJSV0.dFT3ccLBO7qhh3Ck2ISs4tHhqLv1vy0p2PbcVzazIhRIxhRKVZY.YtEH.E_Ct9FU5',
        })
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toEqual(errorMessageHelper());
    });

    it('/blogs (PUT) should successfully update a blog with valid data', async () => {
      await request(app.getHttpServer())
        .put('/blogs/' + blogId)
        .auth(constantHelper.superAdmin.user, constantHelper.superAdmin.pass)
        .send({
          name: createStringHelper(10),
          description: createStringHelper(8),
          websiteUrl:
            'https://-Pd5J4cMUMlF3DsJSV0.dFT3ccLBO7qhh3Ck2ISs4tHhqLv1vy0p2PbcVzazIhRIxhRKVZY.YtEH.E_Ct9FU5',
        })
        .expect(HttpStatus.NO_CONTENT);
    });
  });

  describe('DELETE /blogs update blog', () => {
    it('/blogs (DELETE) should return 401 when trying to delete a blog with invalid super admin credentials', async () => {
      const response = await request(app.getHttpServer())
        .delete('/blogs/' + blogId)
        .auth(
          constantHelper.invalidSuperAdmin.user,
          constantHelper.invalidSuperAdmin.pass,
        )
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body).toEqual(errorMessageHelper());
    });

    it('/blogs (DELETE) should return 404 when trying to delete a blog that does not exist', async () => {
      const response = await request(app.getHttpServer())
        .delete('/blogs/' + constantHelper.invalidId)
        .auth(constantHelper.superAdmin.user, constantHelper.superAdmin.pass)
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toEqual(errorMessageHelper());
    });

    it('/blogs (DELETE) should successfully delete a blog with valid credentials', async () => {
      await request(app.getHttpServer())
        .delete('/blogs/' + blogId)
        .auth(constantHelper.superAdmin.user, constantHelper.superAdmin.pass)
        .expect(HttpStatus.NO_CONTENT);
    });
  });
});
