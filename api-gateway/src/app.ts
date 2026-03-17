import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import { setupProxies } from './proxy';
import { ROUTES } from './routes/routes';
import { setupLogging } from './logging';

const app: Express = express();
setupLogging(app);

app.use(cors());

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('/ of API Gateway');
})

setupProxies(app, ROUTES);

app.use(function(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack); 
  res.status(500).send('Something broke!'); 
});

export default app;