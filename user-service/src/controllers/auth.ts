import { NextFunction, Request, Response } from 'express';
import * as authService from '../services/auth';
import { AppError } from '../utils/errors';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    next(new AppError('Missing fields', 400));
    return;
  }

  try {
    const result = await authService.signup({ name, email, password });

    if (!result) {
      next(new AppError('User already exists', 409));
      return;
    }

    res.status(201).json(result);
    return;
  } catch (error) {
    next(error);
    return;
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new AppError('Missing credentials', 400));
    return;
  }

  try {
    const result = await authService.login(email, password);

    if (!result) {
      next(new AppError('Invalid credentials', 401));
      return;
    }

    res.json(result);
    return;
  } catch (error) {
    next(error);
    return;
  }

};