import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST ||'user_pgdb',
  port: 5432,
  user: process.env.DB_USERNAME || 'user',
  password: process.env.DB_PASSWORD || 'mdp',
  database: process.env.DB_NAME || 'users-btp'
});

export default pool;
