import { Request, Response } from 'express';
import * as userService from '../services/user';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error in getUsers: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Error in getUserById: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }

};

export const getMe = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;

  try {
    const user = await userService.getUserById(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error in getMe: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!email || !name || !password) {
    res.status(400).json({ message: 'Fields are missing' });
  }

  try {
    const newUser = await userService.createUser({ name, email, password });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error in createUser: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { name, email, newPassword, currentPassword } = req.body;

  if (!currentPassword) {
    res.status(400).json({ message: 'Current password is required' });
  }

  if (!name && !email && !newPassword) {
    res.status(400).json({ message: 'At least one field (name, email, newPassword) is required' });
  }

  try {
    const success = await userService.updateUser(req.params.id, {
      name,
      email,
      newPassword,
      currentPassword,
    });

    if (!success) {
      res.status(403).json({ message: 'Invalid credentials' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error in updateUser: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const deleteUser = async (req: Request, res: Response) => {
  try {
    const success = await userService.deleteUser(req.params.id);

    if (!success) { 
      res.status(404).json({ message: 'User not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteUser: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }

};