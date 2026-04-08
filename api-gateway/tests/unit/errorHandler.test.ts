import { NextFunction, Request, Response } from 'express';
import { errorHandler, notFoundHandler } from '../../src/middlewares/errorHandler';

describe('error handlers', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    jest.restoreAllMocks();
  });

  it('notFoundHandler should return 404 payload', () => {
    const req = {
      method: 'GET',
      originalUrl: '/missing',
    } as Request;

    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const res = { status } as unknown as Response;

    notFoundHandler(req, res, jest.fn() as unknown as NextFunction);

    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({ message: 'Route not found: GET /missing' });
  });

  it('errorHandler should delegate to next when headers are already sent', () => {
    const req = {
      method: 'GET',
      originalUrl: '/users',
    } as Request;

    const res = {
      headersSent: true,
      status: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as unknown as NextFunction;
    const err = new Error('already sent');

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    errorHandler(err, req, res, next);

    expect(next).toHaveBeenCalledWith(err);
    expect(res.status).not.toHaveBeenCalled();
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it('errorHandler should expose debug details in dev mode', () => {
    process.env.NODE_ENV = 'dev';

    const req = {
      method: 'GET',
      originalUrl: '/users',
    } as Request;

    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const res = { headersSent: false, status } as unknown as Response;
    const next = jest.fn() as unknown as NextFunction;
    const err = new Error('boom');

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    errorHandler(err, req, res, next);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ message: 'boom', stack: expect.any(String) }));
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('errorHandler should keep responses minimal in prod mode', () => {
    process.env.NODE_ENV = 'prod';

    const req = {
      method: 'GET',
      originalUrl: '/users',
    } as Request;

    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const res = { headersSent: false, status } as unknown as Response;
    const next = jest.fn() as unknown as NextFunction;
    const err = new Error('boom');

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    errorHandler(err, req, res, next);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ message: 'Internal server error' });
    expect(consoleSpy).toHaveBeenCalled();
  });
});