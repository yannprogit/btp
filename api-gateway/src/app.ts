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

app.get('/api/config', (req: Request, res: Response) => {
    const isDev = ['dev', 'development'].includes((process.env.NODE_ENV ?? '').toLowerCase());
    res.json({ isDevelopmentMode: isDev });
});

setupProxies(app, ROUTES);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;