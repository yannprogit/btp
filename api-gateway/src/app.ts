import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import { setupProxies } from './proxy';
import { ROUTES } from './routes/routes';
import { setupLogging } from './logging';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

const app: Express = express();
setupLogging(app);

app.use(cors());

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('/ of API Gateway');
})

setupProxies(app, ROUTES);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;