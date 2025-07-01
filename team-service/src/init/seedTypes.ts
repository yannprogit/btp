import db from '../config/db';

const baseTypes = [
  'normal', 
  'fire', 
  'water', 
  'electric', 
  'grass', 
  'ice',
  'fighting', 
  'poison', 
  'ground', 
  'flying', 
  'psychic',
  'bug', 
  'rock', 
  'ghost', 
  'dragon', 
  'dark', 
  'steel', 
  'fairy'
];

export const seedTypes = async () => {
  for (const type of baseTypes) {
    await db.query(`INSERT INTO types (name) VALUES ($1) ON CONFLICT DO NOTHING`, [type]);
  }
  console.log('Types was seeded.');
};