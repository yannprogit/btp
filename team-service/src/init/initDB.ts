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
  } catch (err) {
    console.error("Error with the creation of table teams:", err);
  }
};
