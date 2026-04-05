import { Request, Response } from 'express';
import * as authController from '../../../src/controllers/auth';
import * as authService from '../../../src/services/auth';

jest.mock('../../../src/services/auth');

describe('auth controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('signup should return 201 with result', async () => {
    const req = {
      body: { name: 'Alice', email: 'alice@example.com', password: 'pwd' }
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    const payload = { token: 'token', user: { id: '1', name: 'Alice', email: 'alice@example.com' } };
    (authService.signup as jest.Mock).mockResolvedValue(payload);

    await authController.signup(req, res);

    expect(authService.signup).toHaveBeenCalledWith({ name: 'Alice', email: 'alice@example.com', password: 'pwd' });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(payload);
  });

  it('signup should return 400 when fields are missing', async () => {
    const req = {
      body: { email: 'alice@example.com' }
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    await authController.signup(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Missing fields' });
    expect(authService.signup).not.toHaveBeenCalled();
  });

  it('signup should return 409 when user already exists', async () => {
    const req = {
      body: { name: 'Alice', email: 'alice@example.com', password: 'pwd' }
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    (authService.signup as jest.Mock).mockResolvedValue(null);

    await authController.signup(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
  });

  it('signup should return 500 when service throws', async () => {
    const req = {
      body: { name: 'Alice', email: 'alice@example.com', password: 'pwd' }
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    (authService.signup as jest.Mock).mockRejectedValue(new Error('failure'));

    await authController.signup(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });

  it('login should return payload', async () => {
    const req = {
      body: { email: 'alice@example.com', password: 'pwd' }
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    const payload = { token: 'token', user: { id: '1', email: 'alice@example.com' } };
    (authService.login as jest.Mock).mockResolvedValue(payload);

    await authController.login(req, res);

    expect(authService.login).toHaveBeenCalledWith('alice@example.com', 'pwd');
    expect(res.json).toHaveBeenCalledWith(payload);
  });

  it('login should return 400 when credentials are missing', async () => {
    const req = {
      body: { email: 'alice@example.com' }
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Missing credentials' });
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('login should return 401 when credentials are invalid', async () => {
    const req = {
      body: { email: 'alice@example.com', password: 'pwd' }
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    (authService.login as jest.Mock).mockResolvedValue(null);

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });

  it('login should return 500 when service throws', async () => {
    const req = {
      body: { email: 'alice@example.com', password: 'pwd' }
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    (authService.login as jest.Mock).mockRejectedValue(new Error('failure'));

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});
