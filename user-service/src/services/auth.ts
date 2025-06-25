import { signToken } from '../utils/jwt.js';
import { User } from '../models/user';
import bcrypt from 'bcrypt';
import pool from '../config/db';

export const signup = async ({ name, email, password }: Omit<User, 'id'>) => {
  try {
    const existEmail = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existEmail.rows.length > 0) {
      return null;
    } 

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );

    const user = result.rows[0];

    const token = signToken({ id: user.id, email: user.email });

    return { token, user };
  } catch (err) {
    console.error("Signup error: ", err);
    return null;
  }
};

export const login = async (email: string, password: string) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];
  if (!user) {
    return null;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return null;
  } 

  const token = signToken({ id: user.id, email });
  return { token, user: { id: user.id, name: user.name, email } };
};
