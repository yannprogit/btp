import { Request, Response } from 'express';
import * as authController from '../../../src/controllers/auth';
import * as authService from '../../../src/services/auth';
import { AppError } from '../../../src/utils/errors';

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
    const next = jest.fn();

    const payload = { token: 'token', user: { id: '1', name: 'Alice', email: 'alice@example.com' } };
    (authService.signup as jest.Mock).mockResolvedValue(payload);

    await authController.signup(req, res, next);

    expect(authService.signup).toHaveBeenCalledWith({ name: 'Alice', email: 'alice@example.com', password: 'pwd' });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(payload);
    expect(next).not.toHaveBeenCalled();
  });

  it('signup should forward 400 AppError when fields are missing', async () => {
    const req = {
      body: { email: 'alice@example.com' }
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;
    const next = jest.fn();

    await authController.signup(req, res, next);

    const err = next.mock.calls[0][0] as AppError;
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe('Missing fields');
    expect(authService.signup).not.toHaveBeenCalled();
  });

  it('signup should forward 409 AppError when user already exists', async () => {
    const req = {
      body: { name: 'Alice', email: 'alice@example.com', password: 'pwd' }
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;
    const next = jest.fn();

    (authService.signup as jest.Mock).mockResolvedValue(null);

    await authController.signup(req, res, next);

    const err = next.mock.calls[0][0] as AppError;
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(409);
    expect(err.message).toBe('User already exists');
  });

  it('signup should forward service errors to next', async () => {
    const req = {
      body: { name: 'Alice', email: 'alice@example.com', password: 'pwd' }
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;
    const next = jest.fn();

    const failure = new Error('failure');
    (authService.signup as jest.Mock).mockRejectedValue(failure);

    await authController.signup(req, res, next);

    expect(next).toHaveBeenCalledWith(failure);
  });

  it('login should return payload', async () => {
    const req = {
      body: { email: 'alice@example.com', password: 'pwd' }
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;
    const next = jest.fn();

    const payload = { token: 'token', user: { id: '1', email: 'alice@example.com' } };
    (authService.login as jest.Mock).mockResolvedValue(payload);

    await authController.login(req, res, next);

    expect(authService.login).toHaveBeenCalledWith('alice@example.com', 'pwd');
    expect(res.json).toHaveBeenCalledWith(payload);
    expect(next).not.toHaveBeenCalled();
  });

  it('login should forward 400 AppError when credentials are missing', async () => {
    const req = {
      body: { email: 'alice@example.com' }
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;
    const next = jest.fn();

    await authController.login(req, res, next);

    const err = next.mock.calls[0][0] as AppError;
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe('Missing credentials');
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('login should forward 401 AppError when credentials are invalid', async () => {
    const req = {
      body: { email: 'alice@example.com', password: 'pwd' }
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;
    const next = jest.fn();

    (authService.login as jest.Mock).mockResolvedValue(null);

    await authController.login(req, res, next);

    const err = next.mock.calls[0][0] as AppError;
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(401);
    expect(err.message).toBe('Invalid credentials');
  });

  it('login should forward service errors to next', async () => {
    const req = {
      body: { email: 'alice@example.com', password: 'pwd' }
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;
    const next = jest.fn();

    const failure = new Error('failure');
    (authService.login as jest.Mock).mockRejectedValue(failure);

    await authController.login(req, res, next);

    expect(next).toHaveBeenCalledWith(failure);
  });
});
