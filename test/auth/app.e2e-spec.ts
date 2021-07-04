import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import * as faker from 'faker';
import { UserRepository } from '../../src/auth/user.repository';
import { getConnection } from 'typeorm';

let userRepository: UserRepository;
describe('/auth/sign-up (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    userRepository = moduleFixture.get('UserRepository');

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  beforeEach(async () => {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from('user')
      .where({})
      .execute();
  });

  afterAll(async () => {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from('user')
      .where({})
      .execute();
    app.close();
  });

  it('should create an user', async () => {
    const reqBody = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    };
    const result = await request(app.getHttpServer())
      .post('/auth/sign-up')
      .send(reqBody);

    const userFromDB = await userRepository.findOne({ id: result.body.id });
    
    expect(userFromDB).toEqual({
      id: result.body.id,
      username: reqBody.username,
      password: expect.any(String),
      tasks: [],
    });

    const validateUserPasswordResult = await userRepository.validateUserPassword(
      reqBody,
    );

    expect(validateUserPasswordResult).toBeTruthy();
  });
});
