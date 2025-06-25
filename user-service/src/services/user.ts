import pool from '../config/db';
import { User } from '../models/user';

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const result = await pool.query('SELECT * FROM users');
    return result.rows as User[];
  } catch (err) {
    console.error('Get all users error: ', err);
    return [];
  }
};