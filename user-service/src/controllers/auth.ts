import { Request, Response } from 'express';
import * as authService from '../services/auth';

export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const result = await authService.signup({ name, email, password });

    if (!result) {
      res.status(409).json({ message: 'User already exists' });
    }

    res.status(201).json(result);
  } catch (error) {
    console.error('Error in signup: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Missing credentials' });
  }

  try {
    const result = await authService.login(email, password);

    if (!result) {
      res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error in login: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }

};