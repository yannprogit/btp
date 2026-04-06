import type { Application } from 'express';
import { setupProxies } from '../../src/proxy';

const createProxyMiddleware = jest.fn((proxyConfig: { target: string }) => {
  return `mock-middleware-${proxyConfig.target}`;
});

jest.mock('http-proxy-middleware', () => ({
  createProxyMiddleware: (proxyConfig: { target: string }) => createProxyMiddleware(proxyConfig),
}));

describe('setupProxies', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register one proxy middleware per route', () => {
    const app = {
      use: jest.fn(),
    } as unknown as Application;

    const routes = [
      {
        url: '/users',
        auth: false,
        creditCheck: false,
        proxy: { target: 'http://user-app:5555', changeOrigin: true },
      },
      {
        url: '/teams',
        auth: false,
        creditCheck: false,
        proxy: { target: 'http://team-app:5050', changeOrigin: true },
      },
    ];

    setupProxies(app, routes);

    expect(createProxyMiddleware).toHaveBeenCalledTimes(2);
    expect(createProxyMiddleware).toHaveBeenNthCalledWith(1, routes[0].proxy);
    expect(createProxyMiddleware).toHaveBeenNthCalledWith(2, routes[1].proxy);
    expect(app.use).toHaveBeenNthCalledWith(1, '/users', 'mock-middleware-http://user-app:5555');
    expect(app.use).toHaveBeenNthCalledWith(2, '/teams', 'mock-middleware-http://team-app:5050');
  });
});