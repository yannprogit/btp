import pool from '../config/db';

export const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS teams (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        userId VARCHAR(100) NOT NULL
      );
    `);
    console.log("Table teams was created !");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS types (
        name VARCHAR(50) PRIMARY KEY
      );
    `);
    console.log("Table types was created");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS pokemon (
        id SERIAL PRIMARY KEY,
        speciesId INT NOT NULL,
        sprite VARCHAR(100),
        name VARCHAR(100)
      );
    `);
    console.log("Table pokemons was created");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS moves (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        type VARCHAR(50) REFERENCES types(name),
        description TEXT,
        accuracy INT,
        damage INT,
        UNIQUE (name, type)
      );
    `);
    console.log("Table moves was created");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS has (
        pkmnId INT REFERENCES pokemon(id) ON DELETE CASCADE,
        type VARCHAR(50) REFERENCES types(name),
        PRIMARY KEY (pkmnId, type)
      );
    `);
    console.log("Table has was created");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS contain (
        teamId INT REFERENCES teams(id) ON DELETE CASCADE,
        pkmnId INT REFERENCES pokemon(id) ON DELETE CASCADE,
        PRIMARY KEY (teamId, pkmnId)
      );
    `);
    console.log("Table contain was created");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS owned (
        pkmnId INT REFERENCES pokemon(id) ON DELETE CASCADE,
        moveId INT REFERENCES moves(id),
        PRIMARY KEY (pkmnId, moveId)
      );
    `);
    console.log("Table owned was created");
  } catch (err) {
    console.error("Error during DB init: ", err);
  }
};
