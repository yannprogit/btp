import { Application } from 'express';
import morgan from 'morgan';

const setupLogging = (app: Application) => {
    const format = ['dev', 'development'].includes((process.env.NODE_ENV ?? '').toLowerCase()) ? 'dev' : 'combined';

    app.use(morgan(format));
};

export { setupLogging };