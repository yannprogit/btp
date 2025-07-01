import pool from '../config/db';
import { Pokemon } from '../models/pokemon';
import { Team } from '../models/team';

export const getTeamsByUser = async (userId: string): Promise<Omit<Team, 'userId' | 'pokemons'>[]> => {
  const teamRes = await pool.query(
    `SELECT id, name FROM teams WHERE userId = $1`,
    [userId]
  );

  return teamRes.rows.map(row => ({
    id: row.id.toString(),
    name: row.name
  }));
};

export const getTeamById = async (teamId: string): Promise<Team> => {
  const teamRes = await pool.query(
    `SELECT id, name, userId FROM teams WHERE id = $1`,
    [teamId]
  );
  const team = teamRes.rows[0];

  if (!team) {
    throw new Error("Team not found");
  }

  const pkmnRes = await pool.query(
    `SELECT p.id, p.speciesId, p.name, p.sprite
     FROM pokemon p
     JOIN contain c ON c.pkmnId = p.id
     WHERE c.teamId = $1`,
    [teamId]
  );

  const pokemons = [];

  for (const pkmn of pkmnRes.rows) {
    const typesRes = await pool.query(
      `SELECT t.name
       FROM has h
       JOIN types t ON h.type = t.name
       WHERE h.pkmnId = $1`,
      [pkmn.id]
    );

    const movesRes = await pool.query(
      `SELECT m.id, m.name, m.accuracy, m.damage, m.description, m.type as "typeName"
       FROM owned o
       JOIN moves m ON o.moveId = m.id
       WHERE o.pkmnId = $1`,
      [pkmn.id]
    );

    const moves = movesRes.rows.map(m => ({
      id: m.id,
      name: m.name,
      accuracy: m.accuracy,
      damage: m.damage,
      description: m.description,
      type: { name: m.typeName }
    }));

    pokemons.push({
      id: pkmn.id,
      speciesId: pkmn.speciesid,
      name: pkmn.name,
      sprite: pkmn.sprite,
      types: typesRes.rows,
      moves
    });
  }

  return {
    id: team.id,
    name: team.name,
    userId: team.userid,
    pokemons
  };
};

export const createTeam = async (team: Omit<Team, 'id'>): Promise<Team> => {
  const teamRes = await pool.query(
    `INSERT INTO teams (name, userId)
    VALUES ($1, $2)
    RETURNING id, name, userId`,
    [team.name, team.userId]
  );
  const createdTeam = teamRes.rows[0];

  for (const pokemon of team.pokemons) {
    const pokemonRes = await pool.query(
      `INSERT INTO pokemon (speciesId, name, sprite)
      VALUES ($1, $2, $3)
      RETURNING id`,
      [pokemon.speciesId, pokemon.name, pokemon.sprite]
    );
    const pokemonId = pokemonRes.rows[0].id;

    await pool.query(
      `INSERT INTO contain (teamId, pkmnId)
      VALUES ($1, $2)`,
      [createdTeam.id, pokemonId]
    );

    for (const type of pokemon.types) {
      await pool.query(
        `INSERT INTO has (pkmnId, type)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING`,
        [pokemonId, type.name]
      );
    }

    for (const move of pokemon.moves) {
      await pool.query(
        `INSERT INTO types (name)
        VALUES ($1)
        ON CONFLICT (name) DO NOTHING`,
        [move.type.name]
      );

      const moveRes = await pool.query(
        `INSERT INTO moves (name, type, description, accuracy, damage)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (name, type) DO NOTHING
        RETURNING id`,
        [move.name, move.type.name, move.description, move.accuracy, move.damage]
      );

      let moveId: number;

      if (moveRes.rows.length > 0) {
        moveId = moveRes.rows[0].id;
      } else {
        const existingMove = await pool.query(
          `SELECT id FROM moves WHERE name = $1 AND type = $2`,
          [move.name, move.type.name]
        );
        moveId = existingMove.rows[0].id;
      }

      await pool.query(
        `INSERT INTO owned (pkmnId, moveId)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING`,
        [pokemonId, moveId]
      );
    }
  }

  return await getTeamById(createdTeam.id);
};

export const updateTeam = async (id: string, updates: { name: string, pokemons: Pokemon[]}): Promise<Boolean> => {
  await pool.query(
    `UPDATE teams SET name = $1 WHERE id = $2`,
    [updates.name, id]
  );

  for (const pkmn of updates.pokemons) {
    let pkmnId = pkmn.id;

    if (!pkmnId) {
      const insertRes = await pool.query(
        `INSERT INTO pokemon (speciesId, name, sprite)
         VALUES ($1, $2, $3)
         RETURNING id`,
        [pkmn.speciesId, pkmn.name, pkmn.sprite]
      );
      pkmnId = insertRes.rows[0].id;

      await pool.query(
        `INSERT INTO contain (teamId, pkmnId)
         VALUES ($1, $2)`,
        [id, pkmnId]
      );
    } else {
      await pool.query(
        `UPDATE pokemon SET name = $1, speciesId = $2
         WHERE id = $3`,
        [pkmn.name, pkmn.speciesId, pkmnId]
      );

      await pool.query(`DELETE FROM has WHERE pkmnId = $1`, [pkmnId]);
      await pool.query(`DELETE FROM owned WHERE pkmnId = $1`, [pkmnId]);
    }

    for (const type of pkmn.types) {
      await pool.query(
        `INSERT INTO has (pkmnId, type)
         VALUES ($1, $2)`,
        [pkmnId, type.name]
      );
    }

    for (const move of pkmn.moves) {
      let moveId = move.id;

      await pool.query(
        `INSERT INTO moves (id, name, description, damage, accuracy, type)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (name, type) DO UPDATE
        SET description = EXCLUDED.description,
            damage = EXCLUDED.damage,
            accuracy = EXCLUDED.accuracy`,
        [move.id, move.name, move.description, move.damage, move.accuracy, move.type.name]
      );

      const moveRes = await pool.query(
        `SELECT id FROM moves WHERE name = $1 AND type = $2`,
        [move.name, move.type.name]
      );

      if (moveRes.rows.length > 0) {
        moveId = moveRes.rows[0].id;
      }

      await pool.query(
        `INSERT INTO owned (pkmnId, moveId)
        VALUES ($1, $2)`,
        [pkmnId, moveId]
      );
    }
  }

  return true;
};

export const deleteTeam = async (id: string): Promise<boolean> => {
  const result = await pool.query('DELETE FROM teams WHERE id = $1', [id]);
  if ((result.rowCount ?? 0) === 0) {
    return false;
  }

  await pool.query(`
    DELETE FROM pokemon
    WHERE id NOT IN (SELECT pkmnId FROM contain)
  `);

  return true;
};