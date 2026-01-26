import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { appSetup } from '../src/setup/app.setup';
import { deleteAllData } from './ helpers/delete-all-data';
import { errorMessageHelper } from './ helpers/error-message.helper';
import { constantHelper } from './ helpers/constant.helper';
import { createStringHelper } from './ helpers/create-string.helper';
import { BlogsMapper } from '../src/modules/bloggers-platform/blogs/mappers/blogs.mapper';
import { PostsMapper } from '../src/modules/bloggers-platform/posts/mappers/blogs.mapper';
import { getAllForPaginationHelper } from './ helpers/get-all-for-pagination.helper';

describe('PostsController (e2e)', () => {
  let app: INestApplication<App>;
  let blogId: string;
  let postId: string;

  const responsePostExample = {
    id: expect.any(String) as string,
    title: expect.any(String) as string,
    shortDescription: expect.any(String) as string,
    content: expect.any(String) as string,
    blogId: expect.any(String) as string,
    blogName: expect.any(String) as string,
    createdAt: expect.any(String) as string,
    extendedLikesInfo: {
      likesCount: expect.any(Number) as number,
      dislikesCount: expect.any(Number) as number,
      myStatus: expect.any(String) as string,
      newestLikes: [],
    },
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

    const responsePost = await request(app.getHttpServer())
      .post('/posts')
      .auth(constantHelper.superAdmin.user, constantHelper.superAdmin.pass)
      .send({
        title: createStringHelper(11),
        shortDescription: createStringHelper(31),
        content: createStringHelper(31),
        blogId: blogId,
      })
      .expect(HttpStatus.CREATED);

    const bodyPost: PostsMapper = responsePost.body as PostsMapper;

    if (bodyPost.id) {
      postId = bodyPost.id;
    }
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('GET /posts', () => {
    it('/posts (GET) should return all posts with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/posts')
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(getAllForPaginationHelper(response));
    });
  });

  describe('GET /blogs/blogId/posts', () => {
    it('/posts (GET) return all posts for specific blog with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get(`/blogs/${blogId}/posts/`)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(getAllForPaginationHelper(response));
    });
  });

  describe('POST /blogs/blogId/posts create posts', () => {
    it('/blogs/blogId/posts (POST) should return 400 when all fields are empty', async () => {
      const response = await request(app.getHttpServer())
        .post(`/blogs/${blogId}/posts/`)
        .auth(constantHelper.superAdmin.user, constantHelper.superAdmin.pass)
        .send({
          title: '',
          shortDescription: '',
          content: '',
        })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toEqual(errorMessageHelper(3));
    });

    it('/blogs/blogId/posts (POST) should return 400 when fields exceed max length', async () => {
      const response = await request(app.getHttpServer())
        .post(`/blogs/${blogId}/posts/`)
        .auth(constantHelper.superAdmin.user, constantHelper.superAdmin.pass)
        .send({
          title: createStringHelper(31),
          shortDescription: createStringHelper(111),
          content: createStringHelper(1031),
        })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toEqual(errorMessageHelper(3));
    });

    it('/blogs/blogId/posts (POST) should return 400 when fields contain only whitespace', async () => {
      const response = await request(app.getHttpServer())
        .post(`/blogs/${blogId}/posts/`)
        .auth(constantHelper.superAdmin.user, constantHelper.superAdmin.pass)
        .send({
          title: ' ',
          shortDescription: ' ',
          content: ' ',
        })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toEqual(errorMessageHelper(3));
    });

    it('/blogs/blogId/posts (POST) should return 404 when blogId does not exist', async () => {
      const response = await request(app.getHttpServer())
        .post(`/blogs/${constantHelper.invalidId}/posts/`)
        .auth(constantHelper.superAdmin.user, constantHelper.superAdmin.pass)
        .send({
          title: createStringHelper(11),
          shortDescription: createStringHelper(31),
          content: createStringHelper(31),
        })
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toEqual(errorMessageHelper());
    });

    it('/blogs/blogId/posts (POST) should return 401 when user credentials are invalid', async () => {
      const response = await request(app.getHttpServer())
        .post(`/blogs/${blogId}/posts/`)
        .auth(
          constantHelper.invalidSuperAdmin.user,
          constantHelper.invalidSuperAdmin.pass,
        )
        .send({
          title: createStringHelper(11),
          shortDescription: createStringHelper(31),
          content: createStringHelper(31),
        })
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body).toEqual(errorMessageHelper());
    });

    it('/blogs/blogId/posts (POST) should create a post successfully with valid data', async () => {
      const response = await request(app.getHttpServer())
        .post(`/blogs/${blogId}/posts/`)
        .auth(constantHelper.superAdmin.user, constantHelper.superAdmin.pass)
        .send({
          title: createStringHelper(11),
          shortDescription: createStringHelper(31),
          content: createStringHelper(31),
        })
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual(responsePostExample);
    });
  });

  describe('POST /posts create posts', () => {
    it('/posts (POST) should return 400 if all fields are empty', async () => {
      const response = await request(app.getHttpServer())
        .post('/posts')
        .auth(constantHelper.superAdmin.user, constantHelper.superAdmin.pass)
        .send({
          title: '',
          shortDescription: '',
          content: '',
          blogId: '',
        })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toEqual(errorMessageHelper(4));
    });

    it('/posts (POST) should return 400 if fields exceed max length', async () => {
      const response = await request(app.getHttpServer())
        .post('/posts')
        .auth(constantHelper.superAdmin.user, constantHelper.superAdmin.pass)
        .send({
          title: createStringHelper(31),
          shortDescription: createStringHelper(111),
          content: createStringHelper(1031),
          blogId: ' ',
        })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toEqual(errorMessageHelper(4));
    });

    it('/posts (POST) should return 400 if fields contain only spaces', async () => {
      const response = await request(app.getHttpServer())
        .post('/posts')
        .auth(constantHelper.superAdmin.user, constantHelper.superAdmin.pass)
        .send({
          title: ' ',
          shortDescription: ' ',
          content: ' ',
          blogId: ' ',
        })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toEqual(errorMessageHelper(4));
    });

    it('/posts (POST) should return 404 if blogId does not exist', async () => {
      const response = await request(app.getHttpServer())
        .post('/posts')
        .auth(constantHelper.superAdmin.user, constantHelper.superAdmin.pass)
        .send({
          title: createStringHelper(11),
          shortDescription: createStringHelper(31),
          content: createStringHelper(31),
          blogId: constantHelper.invalidId,
        })
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toEqual(errorMessageHelper());
    });

    it('/posts (POST) should return 401 if credentials are invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/posts')
        .auth(
          constantHelper.invalidSuperAdmin.user,
          constantHelper.invalidSuperAdmin.pass,
        )
        .send({
          title: createStringHelper(11),
          shortDescription: createStringHelper(31),
          content: createStringHelper(31),
          blogId: blogId,
        })
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body).toEqual(errorMessageHelper());
    });

    it('/posts (POST) should return 201 and create post if input is valid', async () => {
      const response = await request(app.getHttpServer())
        .post('/posts')
        .auth(constantHelper.superAdmin.user, constantHelper.superAdmin.pass)
        .send({
          title: createStringHelper(11),
          shortDescription: createStringHelper(31),
          content: createStringHelper(31),
          blogId: blogId,
        })
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual(responsePostExample);
    });
  });

  describe('GET /posts/:id', () => {
    it("/posts/:id' (GET) should return 404 for invalid post id", async () => {
      const response = await request(app.getHttpServer())
        .get('/posts/' + constantHelper.invalidId)
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toEqual(errorMessageHelper());
    });

    it('/posts/:id (GET) should return the post for a valid id', async () => {
      const response = await request(app.getHttpServer())
        .get('/posts/' + postId)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(responsePostExample);
    });
  });

  describe('PUT /posts/:id', () => {
    it('/posts/:id (PUT) should return 400 when all fields are empty', async () => {
      const response = await request(app.getHttpServer())
        .put('/posts/' + postId)
        .auth(constantHelper.superAdmin.user, constantHelper.superAdmin.pass)
        .send({
          title: '',
          shortDescription: '',
          content: '',
          blogId: '',
        })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toEqual(errorMessageHelper(4));
    });

    it('/posts/:id (PUT) should return 400 when all fields contain only spaces', async () => {
      const response = await request(app.getHttpServer())
        .put('/posts/' + postId)
        .auth(constantHelper.superAdmin.user, constantHelper.superAdmin.pass)
        .send({
          title: ' ',
          shortDescription: ' ',
          content: ' ',
          blogId: ' ',
        })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toEqual(errorMessageHelper(4));
    });

    it('/posts/:id (PUT) should return 400 when fields exceed max length', async () => {
      const response = await request(app.getHttpServer())
        .put('/posts/' + postId)
        .auth(constantHelper.superAdmin.user, constantHelper.superAdmin.pass)
        .send({
          title: createStringHelper(31),
          shortDescription: createStringHelper(111),
          content: createStringHelper(1031),
          blogId: '',
        })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toEqual(errorMessageHelper(4));
    });

    it('/posts/:id (PUT) should return 404 when blogId is invalid', async () => {
      const response = await request(app.getHttpServer())
        .put('/posts/' + postId)
        .auth(constantHelper.superAdmin.user, constantHelper.superAdmin.pass)
        .send({
          title: createStringHelper(11),
          shortDescription: createStringHelper(11),
          content: createStringHelper(10),
          blogId: constantHelper.invalidId,
        })
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toEqual(errorMessageHelper());
    });

    it('/posts/:id (PUT) should return 404 when postId is invalid', async () => {
      const response = await request(app.getHttpServer())
        .put('/posts/' + constantHelper.invalidId)
        .auth(constantHelper.superAdmin.user, constantHelper.superAdmin.pass)
        .send({
          title: createStringHelper(11),
          shortDescription: createStringHelper(11),
          content: createStringHelper(10),
          blogId: blogId,
        })
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toEqual(errorMessageHelper());
    });

    it('/posts/:id (PUT) should return 401 for unauthorized user', async () => {
      const response = await request(app.getHttpServer())
        .put('/posts/' + postId)
        .auth(
          constantHelper.invalidSuperAdmin.user,
          constantHelper.invalidSuperAdmin.pass,
        )
        .send({
          title: createStringHelper(11),
          shortDescription: createStringHelper(11),
          content: createStringHelper(10),
          blogId: blogId,
        })
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body).toEqual(errorMessageHelper());
    });

    it('/posts/:id (PUT) should return 204 on successful update with valid data', async () => {
      await request(app.getHttpServer())
        .put('/posts/' + postId)
        .auth(constantHelper.superAdmin.user, constantHelper.superAdmin.pass)
        .send({
          title: createStringHelper(11),
          shortDescription: createStringHelper(11),
          content: createStringHelper(10),
          blogId: blogId,
        })
        .expect(HttpStatus.NO_CONTENT);
    });
  });

  describe('DELETE /posts/:id', () => {
    it('/posts/:id (DELETE) should return 404 when postId is invalid', async () => {
      const response = await request(app.getHttpServer())
        .delete('/posts/' + constantHelper.invalidId)
        .auth(constantHelper.superAdmin.user, constantHelper.superAdmin.pass)
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toEqual(errorMessageHelper());
    });

    it('/posts/:id (DELETE) should return 401 for unauthorized user', async () => {
      const response = await request(app.getHttpServer())
        .delete('/posts/' + postId)
        .auth(
          constantHelper.invalidSuperAdmin.user,
          constantHelper.invalidSuperAdmin.pass,
        )
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body).toEqual(errorMessageHelper());
    });

    it('/posts/:id (DELETE) should return 204 on successful deletion', async () => {
      await request(app.getHttpServer())
        .delete('/posts/' + postId)
        .auth(constantHelper.superAdmin.user, constantHelper.superAdmin.pass)
        .expect(HttpStatus.NO_CONTENT);
    });
  });
});
