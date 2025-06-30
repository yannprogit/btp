import database from '../config/db';
import { Team } from '../models/team';

export const getTeamsByUser = async (userId: string): Promise<Team[]> => {
    const result = await database.query('SELECT * FROM teams WHERE userId = $1', [userId]);
    return result.rows;
};

export const getTeamById = async (id: string): Promise<Team[]> => {
    const result = await database.query('SELECT * FROM teams WHERE id = $1', [id]);
    return result.rows[0] || null;
};

export const createTeam = async (team: Omit<Team, 'id'>): Promise<Team> => {
  const result = await database.query(
    `INSERT INTO teams (name, userId)
    VALUES ($1, $2)
    RETURNING id, name, userId`,
    [team.name, team.userId]
  );
  return result.rows[0];
};

export const updateTeam = async (id: string, name: string): Promise<Team | null> => {
  const result = await database.query(
    `UPDATE teams SET name = $1 WHERE id = $2 RETURNING id, name, userId`,
    [name, id]
  );
  return result.rows[0] || null;
};


export const deleteTeam = async (id: string): Promise<boolean> => {
  const result = await database.query('DELETE FROM teams WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
};