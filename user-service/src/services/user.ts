import database from '../config/db';
import { User } from '../models/user';

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const result = await database.query('SELECT * FROM users');
    return result.rows as User[];
  } catch (err) {
    console.error('Error:', err);
    return [];
  }
};

export const getUserById = async (id: string): Promise<User | null> => {
  const result = await database.query('SELECT id, name, email FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const createUser = async (user: User): Promise<User> => {
  const result = await database.query(
    `INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, name, email`,
    [user.name, user.email, user.password]
  );
  return result.rows[0];
};



export const updateUser = async (id: string, updates: Partial<User>): Promise<User | null> => {
  const fields = [];
  const values = [];
  let i = 1;

  for (const [key, value] of Object.entries(updates)) {
    fields.push(`${key} = $${i++}`);
    values.push(value);
  }

  if (fields.length === 0) return getUserById(id); // nothing to update

  values.push(id); // last param for WHERE id
  const result = await database.query(
    `UPDATE users SET ${fields.join(', ')}
    WHERE id = $${i}
    RETURNING id, name, email`,
    values
  );

  return result.rows[0] || null;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const result = await database.query('DELETE FROM users WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
};
