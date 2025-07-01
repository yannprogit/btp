import dotenv from 'dotenv';
dotenv.config();
import { initDB } from './init/initDB';
import { seedTypes } from './init/seedTypes';

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { setupLogging } from './logging';
import teamRoutes from './routes/team';

const app: Express = express();
const router = app.router;
const port = process.env.API_PORT || 5050;

setupLogging(app);

app.use(cors());
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`Received request: ${req.method} ${req.originalUrl}`);
  next();
});

app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

router.use('/', teamRoutes);

const startServer = async () => {
  await initDB();
  await seedTypes();
  app.listen(5050, '0.0.0.0', () => {
    console.log(`Running on http://0.0.0.0:${port}`);
  });
};

startServer();
