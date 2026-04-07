import express, { Application, NextFunction, Request, Response } from 'express';
import request from 'supertest';
import { setupProxies } from '../../src/proxy';
import { ROUTES } from '../../src/routes/routes';
import { errorHandler } from '../../src/middlewares/errorHandler';

const createProxyMiddleware = jest.fn((proxyConfig: { target: string }) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.path.includes('proxy-fail')) {
      next(new Error(`upstream unavailable: ${proxyConfig.target}`));
      return;
    }

    if (req.path.includes('unauthorized')) {
      res.setHeader('x-upstream-status', '401');
      res.status(401).json({ message: 'Unauthorized from upstream' });
      return;
    }

    res.setHeader('x-proxied-target', proxyConfig.target);
    res.status(200).json({ proxiedTo: proxyConfig.target });
  };
});

jest.mock('http-proxy-middleware', () => ({
  createProxyMiddleware: (proxyConfig: { target: string }) => createProxyMiddleware(proxyConfig),
}));

describe('API Gateway Proxy Routing', () => {
  let app: Application;

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    setupProxies(app, ROUTES);
    app.use(errorHandler);
  });

  it('should proxy /users, /teams and /pokeapi routes to configured targets', async () => {
    const usersResponse = await request(app).get('/users/ping');
    const teamsResponse = await request(app).get('/teams/ping');
    const pokeapiResponse = await request(app).get('/pokeapi/ping');

    expect(usersResponse.status).toBe(200);
    expect(usersResponse.headers['x-proxied-target']).toBe(ROUTES[0].proxy.target);
    expect(teamsResponse.status).toBe(200);
    expect(teamsResponse.headers['x-proxied-target']).toBe(ROUTES[1].proxy.target);
    expect(pokeapiResponse.status).toBe(200);
    expect(pokeapiResponse.headers['x-proxied-target']).toBe(ROUTES[2].proxy.target);
  });

  it('should propagate upstream status and headers', async () => {
    const response = await request(app).get('/users/unauthorized');

    expect(response.status).toBe(401);
    expect(response.headers['x-upstream-status']).toBe('401');
    expect(response.body).toEqual({ message: 'Unauthorized from upstream' });
  });

  it.each(['/users/proxy-fail', '/teams/proxy-fail', '/pokeapi/proxy-fail'])(
    'should return 500 when upstream route %s fails',
    async (path) => {
      const response = await request(app).get(path);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal server error' });
    },
  );
});