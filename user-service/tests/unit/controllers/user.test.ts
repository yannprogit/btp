import { Request, Response } from 'express';
import * as userController from '../../../src/controllers/user';
import * as userService from '../../../src/services/user';
import { AppError } from '../../../src/utils/errors';

jest.mock('../../../src/services/user');

describe('user controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getUsers should return users', async () => {
    const req = {} as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    const next = jest.fn();

    const users = [{ id: '1', name: 'Alice', email: 'alice@example.com' }];
    (userService.getAllUsers as jest.Mock).mockResolvedValue(users);

    await userController.getUsers(req, res, next);

    expect(res.json).toHaveBeenCalledWith(users);
    expect(next).not.toHaveBeenCalled();
  });

  it('getUsers should forward errors to next', async () => {
    const req = {} as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    const next = jest.fn();

    const failure = new Error('failure');
    (userService.getAllUsers as jest.Mock).mockRejectedValue(failure);

    await userController.getUsers(req, res, next);

    expect(next).toHaveBeenCalledWith(failure);
  });

  it('getUserById should return user', async () => {
    const req = { params: { id: '1' } } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    const next = jest.fn();

    const user = { id: '1', name: 'Alice', email: 'alice@example.com' };
    (userService.getUserById as jest.Mock).mockResolvedValue(user);

    await userController.getUserById(req, res, next);

    expect(userService.getUserById).toHaveBeenCalledWith('1');
    expect(res.json).toHaveBeenCalledWith(user);
    expect(next).not.toHaveBeenCalled();
  });

  it('getUserById should forward 404 AppError when not found', async () => {
    const req = { params: { id: '1' } } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    const next = jest.fn();

    (userService.getUserById as jest.Mock).mockResolvedValue(null);

    await userController.getUserById(req, res, next);

    const err = next.mock.calls[0][0] as AppError;
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe('User not found');
  });

  it('getMe should return profile', async () => {
    const req = { user: { id: '1' } } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    const next = jest.fn();

    const user = { id: '1', name: 'Alice', email: 'alice@example.com' };
    (userService.getUserById as jest.Mock).mockResolvedValue(user);

    await userController.getMe(req, res, next);

    expect(userService.getUserById).toHaveBeenCalledWith('1');
    expect(res.json).toHaveBeenCalledWith(user);
    expect(next).not.toHaveBeenCalled();
  });

  it('getMe should forward 404 AppError when profile does not exist', async () => {
    const req = { user: { id: '1' } } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    const next = jest.fn();

    (userService.getUserById as jest.Mock).mockResolvedValue(null);

    await userController.getMe(req, res, next);

    const err = next.mock.calls[0][0] as AppError;
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe('User not found');
  });

  it('createUser should return 201 with user', async () => {
    const req = { body: { name: 'Alice', email: 'alice@example.com', password: 'pwd' } } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    const next = jest.fn();

    const created = { id: '1', name: 'Alice', email: 'alice@example.com' };
    (userService.createUser as jest.Mock).mockResolvedValue(created);

    await userController.createUser(req, res, next);

    expect(userService.createUser).toHaveBeenCalledWith({ name: 'Alice', email: 'alice@example.com', password: 'pwd' });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
    expect(next).not.toHaveBeenCalled();
  });

  it('createUser should forward 400 AppError when fields are missing', async () => {
    const req = { body: { email: 'alice@example.com' } } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    const next = jest.fn();

    await userController.createUser(req, res, next);

    const err = next.mock.calls[0][0] as AppError;
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe('Fields are missing');
    expect(userService.createUser).not.toHaveBeenCalled();
  });

  it('updateUser should return 204 on success', async () => {
    const req = {
      params: { id: '1' },
      body: { name: 'Updated', currentPassword: 'oldpwd' }
    } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() } as unknown as Response;
    const next = jest.fn();

    (userService.updateUser as jest.Mock).mockResolvedValue(true);

    await userController.updateUser(req, res, next);

    expect(userService.updateUser).toHaveBeenCalledWith('1', {
      name: 'Updated',
      email: undefined,
      newPassword: undefined,
      currentPassword: 'oldpwd'
    });
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('updateUser should forward 400 AppError when current password is missing', async () => {
    const req = {
      params: { id: '1' },
      body: { name: 'Updated' }
    } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() } as unknown as Response;
    const next = jest.fn();

    await userController.updateUser(req, res, next);

    const err = next.mock.calls[0][0] as AppError;
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe('Current password is required');
    expect(userService.updateUser).not.toHaveBeenCalled();
  });

  it('updateUser should forward 400 AppError when no update fields are provided', async () => {
    const req = {
      params: { id: '1' },
      body: { currentPassword: 'oldpwd' }
    } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() } as unknown as Response;
    const next = jest.fn();

    await userController.updateUser(req, res, next);

    const err = next.mock.calls[0][0] as AppError;
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe('At least one field (name, email, newPassword) is required');
    expect(userService.updateUser).not.toHaveBeenCalled();
  });

  it('updateUser should forward 403 AppError on invalid credentials', async () => {
    const req = {
      params: { id: '1' },
      body: { name: 'Updated', currentPassword: 'wrong' }
    } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() } as unknown as Response;
    const next = jest.fn();

    (userService.updateUser as jest.Mock).mockResolvedValue(false);

    await userController.updateUser(req, res, next);

    const err = next.mock.calls[0][0] as AppError;
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(403);
    expect(err.message).toBe('Invalid credentials');
  });

  it('deleteUser should return 204 on success', async () => {
    const req = { params: { id: '1' } } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() } as unknown as Response;
    const next = jest.fn();

    (userService.deleteUser as jest.Mock).mockResolvedValue(true);

    await userController.deleteUser(req, res, next);

    expect(userService.deleteUser).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('deleteUser should forward 404 AppError when user is not found', async () => {
    const req = { params: { id: '1' } } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() } as unknown as Response;
    const next = jest.fn();

    (userService.deleteUser as jest.Mock).mockResolvedValue(false);

    await userController.deleteUser(req, res, next);

    const err = next.mock.calls[0][0] as AppError;
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe('User not found');
  });
});
