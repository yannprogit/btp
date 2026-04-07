import request from 'supertest';
import type { Application, NextFunction, Request, Response } from 'express';

jest.mock('../../src/logging', () => ({
  setupLogging: jest.fn(),
}));

jest.mock('../../src/proxy', () => ({
  setupProxies: (app: Application) => {
    app.get('/proxy-error', (_req: Request, _res: Response, next: NextFunction) => {
      next(new Error('proxy failure'));
    });
  },
}));

import app from '../../src/app';

describe('API Gateway E2E', () => {
  it('GET / should return gateway root response', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.text).toBe('/ of API Gateway');
  });

  it('GET /unknown should return 404 from notFoundHandler', async () => {
    const response = await request(app).get('/unknown');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Route not found: GET /unknown' });
  });

  it('GET /proxy-error should return 500 from errorHandler', async () => {
    const response = await request(app).get('/proxy-error');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Internal server error' });
  });
});