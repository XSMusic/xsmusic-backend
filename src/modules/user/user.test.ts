import { UserCreateDto } from '@user';
import { users, cars, brands } from '@testing/mocks/models.mock';
import { api, setMockUsers } from '@testing/helpers/app.helper';
import { bodyGetAll } from '@testing/mocks/body.mock';
import { getAllFromUsers } from '@testing/helpers/helpers';
import { Car } from '@car';
import { Brand } from '@brand';
import { clearDatabase, closeDatabase } from '../../db';
import supertest from 'supertest';

describe('User', () => {
  let apiTest: supertest.SuperTest<supertest.Test>;
  beforeAll(async () => (apiTest = api));
  beforeEach(async () => await setMockUsers());
  afterEach(async () => await clearDatabase());
  afterAll(async () => await closeDatabase());

  describe('Get all users', () => {
    test('users and pagination', async () => {
      const response = await apiTest.post('/users/getAll').send(bodyGetAll);
      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(users.length);
    });

    test('the first user status is ADMIN', async () => {
      const { roles } = await getAllFromUsers();
      expect(roles).toContain('ADMIN');
    });

    test('the second user status is USER', async () => {
      const { roles } = await getAllFromUsers();
      expect(roles).toContain('USER');
    });
  });

  describe('Get one user', () => {
    test('get a valid user', async () => {
      const { items } = await getAllFromUsers();
      const id = items[1]._id.toString();
      await apiTest
        .post('/users/one')
        .send({ id })
        .expect(200)
        .expect('Content-type', /application\/json/);
    });

    test('get a not valid user', async () => {
      await apiTest.post('/users/one').send({ id: '1' }).expect(400);
    });
  });

  describe('Get resume', () => {
    test('getResume', async () => {
      const brand = new Brand(brands[0]);
      const brandSaved = await brand.save();
      cars[0].brand = brandSaved._id;
      const { items } = await getAllFromUsers();
      cars[0].driver = items[0]._id;
      const car = new Car(cars[0]);
      await car.save();
      await apiTest.post('/users/getResume').expect(200);
    });
  });

  describe('Search user', () => {
    test('by name', async () => {
      await apiTest
        .post('/users/search')
        .send({
          value: 'jose',
          limit: 10,
        })
        .expect(200);
    });
  });

  describe('Create user', () => {
    test('a valid user be added', async () => {
      const newUser: UserCreateDto = {
        name: 'Prueba23',
        email: 'perro@perrete.es',
        password: 'perro',
        country: 'es',
        role: 'USER',
      };
      await apiTest.post('/users/create').send(newUser).expect(200);
      const { items } = await getAllFromUsers();
      expect(items).toHaveLength(users.length + 1);
    });

    test('a not valid user be added', async () => {
      await apiTest.post('/users/create').send(users[0]).expect(400);
    });
  });
});
