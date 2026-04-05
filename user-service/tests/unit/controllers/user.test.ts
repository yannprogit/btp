import { Request, Response } from 'express';
import * as userController from '../../../src/controllers/user';
import * as userService from '../../../src/services/user';

jest.mock('../../../src/services/user');

describe('user controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getUsers should return users', async () => {
    const req = {} as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    const users = [{ id: '1', name: 'Alice', email: 'alice@example.com' }];
    (userService.getAllUsers as jest.Mock).mockResolvedValue(users);

    await userController.getUsers(req, res);

    expect(res.json).toHaveBeenCalledWith(users);
  });

  it('getUsers should return 500 on error', async () => {
    const req = {} as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    (userService.getAllUsers as jest.Mock).mockRejectedValue(new Error('failure'));

    await userController.getUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });

  it('getUserById should return user', async () => {
    const req = { params: { id: '1' } } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    const user = { id: '1', name: 'Alice', email: 'alice@example.com' };
    (userService.getUserById as jest.Mock).mockResolvedValue(user);

    await userController.getUserById(req, res);

    expect(userService.getUserById).toHaveBeenCalledWith('1');
    expect(res.json).toHaveBeenCalledWith(user);
  });

  it('getUserById should return 404 when not found', async () => {
    const req = { params: { id: '1' } } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    (userService.getUserById as jest.Mock).mockResolvedValue(null);

    await userController.getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('getMe should return profile', async () => {
    const req = { user: { id: '1' } } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    const user = { id: '1', name: 'Alice', email: 'alice@example.com' };
    (userService.getUserById as jest.Mock).mockResolvedValue(user);

    await userController.getMe(req, res);

    expect(userService.getUserById).toHaveBeenCalledWith('1');
    expect(res.json).toHaveBeenCalledWith(user);
  });

  it('getMe should return 404 when profile does not exist', async () => {
    const req = { user: { id: '1' } } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    (userService.getUserById as jest.Mock).mockResolvedValue(null);

    await userController.getMe(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('createUser should return 201 with user', async () => {
    const req = { body: { name: 'Alice', email: 'alice@example.com', password: 'pwd' } } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    const created = { id: '1', name: 'Alice', email: 'alice@example.com' };
    (userService.createUser as jest.Mock).mockResolvedValue(created);

    await userController.createUser(req, res);

    expect(userService.createUser).toHaveBeenCalledWith({ name: 'Alice', email: 'alice@example.com', password: 'pwd' });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
  });

  it('createUser should return 400 when fields are missing', async () => {
    const req = { body: { email: 'alice@example.com' } } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    await userController.createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Fields are missing' });
    expect(userService.createUser).not.toHaveBeenCalled();
  });

  it('updateUser should return 204 on success', async () => {
    const req = {
      params: { id: '1' },
      body: { name: 'Updated', currentPassword: 'oldpwd' }
    } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() } as unknown as Response;

    (userService.updateUser as jest.Mock).mockResolvedValue(true);

    await userController.updateUser(req, res);

    expect(userService.updateUser).toHaveBeenCalledWith('1', {
      name: 'Updated',
      email: undefined,
      newPassword: undefined,
      currentPassword: 'oldpwd'
    });
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it('updateUser should return 400 when current password is missing', async () => {
    const req = {
      params: { id: '1' },
      body: { name: 'Updated' }
    } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() } as unknown as Response;

    await userController.updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Current password is required' });
    expect(userService.updateUser).not.toHaveBeenCalled();
  });

  it('updateUser should return 400 when no update fields are provided', async () => {
    const req = {
      params: { id: '1' },
      body: { currentPassword: 'oldpwd' }
    } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() } as unknown as Response;

    await userController.updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'At least one field (name, email, newPassword) is required' });
    expect(userService.updateUser).not.toHaveBeenCalled();
  });

  it('updateUser should return 403 on invalid credentials', async () => {
    const req = {
      params: { id: '1' },
      body: { name: 'Updated', currentPassword: 'wrong' }
    } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() } as unknown as Response;

    (userService.updateUser as jest.Mock).mockResolvedValue(false);

    await userController.updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });

  it('deleteUser should return 204 on success', async () => {
    const req = { params: { id: '1' } } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() } as unknown as Response;

    (userService.deleteUser as jest.Mock).mockResolvedValue(true);

    await userController.deleteUser(req, res);

    expect(userService.deleteUser).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it('deleteUser should return 404 when user is not found', async () => {
    const req = { params: { id: '1' } } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() } as unknown as Response;

    (userService.deleteUser as jest.Mock).mockResolvedValue(false);

    await userController.deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });
});
