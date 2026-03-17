import app from './app';
import { initDB } from './init/initDB';

const port = process.env.API_PORT || 5555;

const startServer = async () => {
  await initDB();
  app.listen(5555, '0.0.0.0', () => {
    console.log(`Running on http://0.0.0.0:${port}`);
  });
};

startServer();
