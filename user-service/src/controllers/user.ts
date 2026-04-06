import { NextFunction, Request, Response } from 'express';
import * as userService from '../services/user';
import { AppError } from '../utils/errors';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
    return;
  } catch (error) {
    next(error);
    return;
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getUserById(req.params.id as string);
    if (!user) {
      next(new AppError('User not found', 404));
      return;
    }
    res.json(user);
    return;
  } catch (error) {
    next(error);
    return;
  }

};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user?.id;

  if (!userId) {
    next(new AppError('Unauthorized', 401));
    return;
  }

  try {
    const user = await userService.getUserById(userId);

    if (!user) {
      next(new AppError('User not found', 404));
      return;
    }

    res.json(user);
    return;
  } catch (error) {
    next(error);
    return;
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  if (!email || !name || !password) {
    next(new AppError('Fields are missing', 400));
    return;
  }

  try {
    const newUser = await userService.createUser({ name, email, password });
    res.status(201).json(newUser);
    return;
  } catch (error) {
    next(error);
    return;
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, newPassword, currentPassword } = req.body;

  if (!currentPassword) {
    next(new AppError('Current password is required', 400));
    return;
  }

  if (!name && !email && !newPassword) {
    next(new AppError('At least one field (name, email, newPassword) is required', 400));
    return;
  }

  try {
    const success = await userService.updateUser(req.params.id as string, {
      name,
      email,
      newPassword,
      currentPassword,
    });

    if (!success) {
      next(new AppError('Invalid credentials', 403));
      return;
    }

    res.status(204).send();
    return;
  } catch (error) {
    next(error);
    return;
  }
};


export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const success = await userService.deleteUser(req.params.id as string);

    if (!success) {
      next(new AppError('User not found', 404));
      return;
    }
    res.status(204).send();
    return;
  } catch (error) {
    next(error);
    return;
  }

};