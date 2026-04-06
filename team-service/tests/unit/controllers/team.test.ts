import { Request, Response } from 'express';
import * as teamController from '../../../src/controllers/team';
import * as teamService from '../../../src/services/team';
import { AppError } from '../../../src/utils/errors';

jest.mock('../../../src/services/team');

describe('team controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getTeamsByUser should return teams', async () => {
    const req = {
      user: { id: '1' }
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as unknown as Response;
    const next = jest.fn();

    const payload = [{ id: '1', name: 'alpha' }];
    (teamService.getTeamsByUser as jest.Mock).mockResolvedValue(payload);

    await teamController.getTeamsByUser(req, res, next);

    expect(teamService.getTeamsByUser).toHaveBeenCalledWith('1');
    expect(res.json).toHaveBeenCalledWith(payload);
    expect(next).not.toHaveBeenCalled();
  });

  it('getTeamsByUser should forward service errors to next', async () => {
    const req = {
      user: { id: '1' }
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as unknown as Response;
    const next = jest.fn();

    const failure = new Error('failure');
    (teamService.getTeamsByUser as jest.Mock).mockRejectedValue(failure);

    await teamController.getTeamsByUser(req, res, next);

    expect(next).toHaveBeenCalledWith(failure);
  });

  it('getTeamById should return a team', async () => {
    const req = {
      params: { id: '10' }
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as unknown as Response;
    const next = jest.fn();

    const payload = { id: '10', name: 'alpha', userId: '1', pokemons: [] };
    (teamService.getTeamById as jest.Mock).mockResolvedValue(payload);

    await teamController.getTeamById(req, res, next);

    expect(teamService.getTeamById).toHaveBeenCalledWith('10');
    expect(res.json).toHaveBeenCalledWith(payload);
    expect(next).not.toHaveBeenCalled();
  });

  it('getTeamById should forward 404 AppError when team is not found', async () => {
    const req = {
      params: { id: '10' }
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as unknown as Response;
    const next = jest.fn();

    (teamService.getTeamById as jest.Mock).mockResolvedValue(null);

    await teamController.getTeamById(req, res, next);

    const err = next.mock.calls[0][0] as AppError;
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe('Team not found');
  });

  it('createTeam should return 201 with created team', async () => {
    const req = {
      body: { name: 'new team', pokemons: [] },
      user: { id: '1' }
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as unknown as Response;
    const next = jest.fn();

    const created = { id: '5', name: 'new team', userId: '1', pokemons: [] };
    (teamService.createTeam as jest.Mock).mockResolvedValue(created);

    await teamController.createTeam(req, res, next);

    expect(teamService.createTeam).toHaveBeenCalledWith({
      name: 'new team',
      userId: '1',
      pokemons: []
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
    expect(next).not.toHaveBeenCalled();
  });

  it('createTeam should forward service errors to next', async () => {
    const req = {
      body: { name: 'new team', pokemons: [] },
      user: { id: '1' }
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as unknown as Response;
    const next = jest.fn();

    const failure = new Error('failure');
    (teamService.createTeam as jest.Mock).mockRejectedValue(failure);

    await teamController.createTeam(req, res, next);

    expect(next).toHaveBeenCalledWith(failure);
  });

  it('createTeam should forward 400 AppError when name is missing', async () => {
    const req = {
      body: { pokemons: [] },
      user: { id: '1' }
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as unknown as Response;
    const next = jest.fn();

    await teamController.createTeam(req, res, next);

    const err = next.mock.calls[0][0] as AppError;
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe('Name is required');
    expect(teamService.createTeam).not.toHaveBeenCalled();
  });

  it('updateTeam should return 204 when updated', async () => {
    const req = {
      params: { id: '2' },
      body: { name: 'updated', pokemons: [] }
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      send: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as unknown as Response;
    const next = jest.fn();

    (teamService.updateTeam as jest.Mock).mockResolvedValue({ id: '2', name: 'updated' });

    await teamController.updateTeam(req, res, next);

    expect(teamService.updateTeam).toHaveBeenCalledWith('2', { name: 'updated', pokemons: [] });
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('updateTeam should forward 400 AppError when name is missing', async () => {
    const req = {
      params: { id: '2' },
      body: { pokemons: [] }
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      send: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as unknown as Response;
    const next = jest.fn();

    await teamController.updateTeam(req, res, next);

    const err = next.mock.calls[0][0] as AppError;
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe('Team name is required');
    expect(teamService.updateTeam).not.toHaveBeenCalled();
  });

  it('updateTeam should forward 404 AppError when team is not found', async () => {
    const req = {
      params: { id: '2' },
      body: { name: 'updated', pokemons: [] }
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      send: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as unknown as Response;
    const next = jest.fn();

    (teamService.updateTeam as jest.Mock).mockResolvedValue(null);

    await teamController.updateTeam(req, res, next);

    const err = next.mock.calls[0][0] as AppError;
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe('Team not found');
  });

  it('deleteTeam should return 204 when deleted', async () => {
    const req = {
      params: { id: '2' }
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      send: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as unknown as Response;
    const next = jest.fn();

    (teamService.deleteTeam as jest.Mock).mockResolvedValue(true);

    await teamController.deleteTeam(req, res, next);

    expect(teamService.deleteTeam).toHaveBeenCalledWith('2');
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('deleteTeam should forward 404 AppError when team is not found', async () => {
    const req = {
      params: { id: '2' }
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      send: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as unknown as Response;
    const next = jest.fn();

    (teamService.deleteTeam as jest.Mock).mockResolvedValue(false);

    await teamController.deleteTeam(req, res, next);

    const err = next.mock.calls[0][0] as AppError;
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe('Team not found');
  });

  it('deleteTeam should forward service errors to next', async () => {
    const req = {
      params: { id: '2' }
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      send: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as unknown as Response;
    const next = jest.fn();

    const failure = new Error('failure');
    (teamService.deleteTeam as jest.Mock).mockRejectedValue(failure);

    await teamController.deleteTeam(req, res, next);

    expect(next).toHaveBeenCalledWith(failure);
  });
});
