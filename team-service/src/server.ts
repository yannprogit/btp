import app from './app';
import { seedTypes } from './init/seedTypes';
import pool from './config/db';

const port = process.env.API_PORT || 5050;

const shutdown = async (reason: string, error?: unknown) => {
  console.error(
    JSON.stringify({
      level: 'fatal',
      timestamp: new Date().toISOString(),
      reason,
      error: error instanceof Error ? error.message : String(error)
    })
  );

  try {
    await pool.end();
  } finally {
    process.exit(1);
  }
};

process.on('unhandledRejection', (reason) => {
  void shutdown('Unhandled promise rejection', reason);
});

process.on('uncaughtException', (error) => {
  void shutdown('Uncaught exception', error);
});

const startServer = async () => {
  try {
    await seedTypes();
    app.listen(5050, '0.0.0.0', () => {
      console.log(`Running on http://0.0.0.0:${port}`);
    });
  } catch (error) {
    await shutdown('Failed to start server', error);
  }
};

startServer();
