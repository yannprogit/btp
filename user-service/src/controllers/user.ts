import { Request, Response } from 'express';
import * as userService from '../services/user';

export const getUsers = async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  res.json(users);
};

export const getUserById = async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) res.status(404).json({ message: 'User not found' });
  res.json(user);
};

export const getMe = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;

  try {
    const user = await userService.getUserById(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error in getMe: ', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!email || !name || !password) {
    res.status(400).json({ message: 'Fields are missing' });
  }

  const newUser = await userService.createUser({ name, email, password });
  res.status(201).json(newUser);
};

export const updateUser = async (req: Request, res: Response) => {
  const { name, email, newPassword, actualPassword } = req.body;

  if (!actualPassword) {
    res.status(400).json({ message: 'Actual password is required' });
  }

  if (!name && !email && !newPassword) {
    res.status(400).json({ message: 'At least one field (name, email, newPassword) is required' });
  }

  const success = await userService.updateUser(req.params.id, {
    name,
    email,
    newPassword,
    actualPassword,
  });

  if (!success) {
    res.status(403).json({ message: 'Invalid credentials' });
  }

  res.status(204).send();
};


export const deleteUser = async (req: Request, res: Response) => {
  const success = await userService.deleteUser(req.params.id);

  if (!success) { 
    res.status(404).json({ message: 'User not found' });
  }
  res.status(204).send();
};