import { Request, Response } from 'express';
import * as teamController from '../../../src/controllers/team';
import * as teamService from '../../../src/services/team';

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

    const payload = [{ id: '1', name: 'alpha' }];
    (teamService.getTeamsByUser as jest.Mock).mockResolvedValue(payload);

    await teamController.getTeamsByUser(req, res);

    expect(teamService.getTeamsByUser).toHaveBeenCalledWith('1');
    expect(res.json).toHaveBeenCalledWith(payload);
  });

  it('getTeamsByUser should return 500 when service throws', async () => {
    const req = {
      user: { id: '1' }
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as unknown as Response;

    (teamService.getTeamsByUser as jest.Mock).mockRejectedValue(new Error('failure'));

    await teamController.getTeamsByUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });

  it('getTeamById should return a team', async () => {
    const req = {
      params: { id: '10' }
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as unknown as Response;

    const payload = { id: '10', name: 'alpha', userId: '1', pokemons: [] };
    (teamService.getTeamById as jest.Mock).mockResolvedValue(payload);

    await teamController.getTeamById(req, res);

    expect(teamService.getTeamById).toHaveBeenCalledWith('10');
    expect(res.json).toHaveBeenCalledWith(payload);
  });

  it('getTeamById should return 404 when team is not found', async () => {
    const req = {
      params: { id: '10' }
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as unknown as Response;

    (teamService.getTeamById as jest.Mock).mockResolvedValue(null);

    await teamController.getTeamById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Team not found' });
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

    const created = { id: '5', name: 'new team', userId: '1', pokemons: [] };
    (teamService.createTeam as jest.Mock).mockResolvedValue(created);

    await teamController.createTeam(req, res);

    expect(teamService.createTeam).toHaveBeenCalledWith({
      name: 'new team',
      userId: '1',
      pokemons: []
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
  });

  it('createTeam should return 500 when service throws', async () => {
    const req = {
      body: { name: 'new team', pokemons: [] },
      user: { id: '1' }
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as unknown as Response;

    (teamService.createTeam as jest.Mock).mockRejectedValue(new Error('failure'));

    await teamController.createTeam(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });

  it('createTeam should return 400 when name is missing', async () => {
    const req = {
      body: { pokemons: [] },
      user: { id: '1' }
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as unknown as Response;

    await teamController.createTeam(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Name are missing' });
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

    (teamService.updateTeam as jest.Mock).mockResolvedValue({ id: '2', name: 'updated' });

    await teamController.updateTeam(req, res);

    expect(teamService.updateTeam).toHaveBeenCalledWith('2', { name: 'updated', pokemons: [] });
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it('updateTeam should return 400 when name is missing', async () => {
    const req = {
      params: { id: '2' },
      body: { pokemons: [] }
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      send: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as unknown as Response;

    await teamController.updateTeam(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Team name is required' });
    expect(teamService.updateTeam).not.toHaveBeenCalled();
  });

  it('updateTeam should return 404 when team is not found', async () => {
    const req = {
      params: { id: '2' },
      body: { name: 'updated', pokemons: [] }
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      send: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as unknown as Response;

    (teamService.updateTeam as jest.Mock).mockResolvedValue(null);

    await teamController.updateTeam(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Team not found' });
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

    (teamService.deleteTeam as jest.Mock).mockResolvedValue(true);

    await teamController.deleteTeam(req, res);

    expect(teamService.deleteTeam).toHaveBeenCalledWith('2');
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it('deleteTeam should return 404 when team is not found', async () => {
    const req = {
      params: { id: '2' }
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      send: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as unknown as Response;

    (teamService.deleteTeam as jest.Mock).mockResolvedValue(false);

    await teamController.deleteTeam(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Team not found' });
  });

  it('deleteTeam should return 500 when service throws', async () => {
    const req = {
      params: { id: '2' }
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      send: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as unknown as Response;

    (teamService.deleteTeam as jest.Mock).mockRejectedValue(new Error('failure'));

    await teamController.deleteTeam(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});
