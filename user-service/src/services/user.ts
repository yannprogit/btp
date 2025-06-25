import database from '../config/db';
import { User } from '../models/user';
import bcrypt from 'bcrypt';

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const result = await database.query('SELECT id, name, email FROM users');
    return result.rows as User[];
  } catch (err) {
    console.error('Get all users error: ', err);
    return [];
  }
};

export const getUserById = async (id: string): Promise<User | null> => {
  const result = await database.query('SELECT id, name, email FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
  const hashed = await bcrypt.hash(user.password, 10);
  const result = await database.query(
    `INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, name, email`,
    [user.name, user.email, hashed]
  );
  return result.rows[0];
};

export const updateUser = async (
  id: string, 
  updates: { 
    name?: string;
    email?: string;
    newPassword?: string;
    actualPassword: string;
  }
): Promise<boolean> => {
  const existing = await database.query('SELECT password FROM users WHERE id = $1', [id]);
  const current = existing.rows[0];
  if (!current) { 
    return false;
  }

  const validPassword = await bcrypt.compare(updates.actualPassword, current.password);
  if (!validPassword) {
    return false;
  }
  
  const fields: string[] = [];
  const values: any[] = [];
  let i = 1;

  if (updates.name) {
    fields.push(`name = $${i++}`);
    values.push(updates.name);
  }

  if (updates.email) {
    fields.push(`email = $${i++}`);
    values.push(updates.email);
  }

  if (updates.newPassword) {
    const hashed = await bcrypt.hash(updates.newPassword, 10);
    fields.push(`password = $${i++}`);
    values.push(hashed);
  }

  if (fields.length === 0) {
    return false;
  }

  values.push(id);

  await database.query(
    `UPDATE users SET ${fields.join(', ')} WHERE id = $${i}`,
    values
  );

  return true;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const result = await database.query('DELETE FROM users WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
};
