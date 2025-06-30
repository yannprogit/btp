import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST ||'team_pgdb',
  port: 5432,
  user: process.env.DB_USERNAME || 'user',
  password: process.env.DB_PASSWORD || 'mdp',
  database: process.env.DB_NAME || 'teams-btp'
});

export default pool;
