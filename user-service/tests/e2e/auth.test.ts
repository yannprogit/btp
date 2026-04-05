import request from 'supertest';
import app from '../../src/app';
import * as authService from '../../src/services/auth';

jest.mock('../../src/services/auth');

describe('Auth E2E', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('POST /auth/signup should return 201 when signup succeeds', async () => {
    const payload = { name: 'Alice', email: 'alice@example.com', password: 'pwd' };
    const result = { token: 'token', user: { id: 1, name: 'Alice', email: 'alice@example.com' } };

    (authService.signup as jest.Mock).mockResolvedValue(result);

    const response = await request(app).post('/auth/signup').send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(result);
  });

  it('POST /auth/signup should return 400 when fields are missing', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .send({ email: 'alice@example.com' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Missing fields' });
  });

  it('POST /auth/signup should return 409 when user already exists', async () => {
    (authService.signup as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .post('/auth/signup')
      .send({ name: 'Alice', email: 'alice@example.com', password: 'pwd' });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ message: 'User already exists' });
  });

  it('POST /auth/login should return 200 with payload', async () => {
    const result = { token: 'token', user: { id: 1, email: 'alice@example.com' } };
    (authService.login as jest.Mock).mockResolvedValue(result);

    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'alice@example.com', password: 'pwd' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(result);
  });

  it('POST /auth/login should return 400 when credentials are missing', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'alice@example.com' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Missing credentials' });
  });

  it('POST /auth/login should return 401 on invalid credentials', async () => {
    (authService.login as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'alice@example.com', password: 'wrong' });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Invalid credentials' });
  });
});
