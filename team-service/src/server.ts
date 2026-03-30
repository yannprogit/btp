import app from './app';
import { seedTypes } from './init/seedTypes';

const port = process.env.API_PORT || 5050;

const startServer = async () => {
    await seedTypes();
    app.listen(5050, '0.0.0.0', () => {
      console.log(`Running on http://0.0.0.0:${port}`);
    });
};

startServer();
