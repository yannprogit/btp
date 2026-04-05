import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import { setupLogging } from './logging';
import teamRoutes from './routes/team';
import { swaggerSpec } from './config/swagger';

const app: Express = express();

setupLogging(app);

app.use(cors());
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`Received request: ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use('/', teamRoutes);

app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;