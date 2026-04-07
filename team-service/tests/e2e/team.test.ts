import request from 'supertest';
import app from '../../src/app';
import * as teamService from '../../src/services/team';
import { signToken } from '../../src/utils/jwt';
import { AppError } from '../../src/utils/errors';

jest.mock('../../src/services/team');
jest.mock('../../src/init/initDB', () => ({
    initDB: jest.fn(),
}));
jest.mock('../../src/init/seedTypes', () => ({
    seedTypes: jest.fn(),
}));

describe('Team Service E2E', () => {
    let token: string;

    beforeAll(() => {
        token = signToken({ id: 1, email: 'test@example.com' });
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('GET / should return 401 without token', async () => {
        const response = await request(app).get('/');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Missing or invalid token' });
    });

    it('GET / should return 401 with invalid token', async () => {
        const response = await request(app)
            .get('/')
            .set('Authorization', 'Bearer invalid-token');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Invalid token' });
    });

    it('GET / should return empty list if no teams', async () => {
        (teamService.getTeamsByUser as jest.Mock).mockResolvedValue([]);

        const response = await request(app)
            .get('/')
            .set('Authorization', `Bearer ${token}`);
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it('GET /:id should return team by id', async () => {
        const mockTeam = {
            id: '1',
            name: 'Alpha',
            userId: '1',
            pokemons: []
        };

        (teamService.getTeamById as jest.Mock).mockResolvedValue(mockTeam);

        const response = await request(app)
            .get('/1')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockTeam);
    });

    it('GET /:id should return 404 when team is not found', async () => {
        (teamService.getTeamById as jest.Mock).mockResolvedValue(null);

        const response = await request(app)
            .get('/404')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Team not found' });
    });

    it('POST / should create a team', async () => {
        const payload = { name: 'New Team', pokemons: [] };
        const created = { id: '2', userId: '1', ...payload };

        (teamService.createTeam as jest.Mock).mockResolvedValue(created);

        const response = await request(app)
            .post('/')
            .set('Authorization', `Bearer ${token}`)
            .send(payload);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(created);
    });

    it('POST / should return 400 when name is missing', async () => {
        const response = await request(app)
            .post('/')
            .set('Authorization', `Bearer ${token}`)
            .send({ pokemons: [] });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Name is required' });
    });

    it('PUT /:id should return 204', async () => {
        (teamService.updateTeam as jest.Mock).mockResolvedValue({ id: '1', name: 'Updated', pokemons: [] });

        const response = await request(app)
            .put('/1')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Updated', pokemons: [] });

        expect(response.status).toBe(204);
    });

    it('PUT /:id should return 400 when name is missing', async () => {
        const response = await request(app)
            .put('/1')
            .set('Authorization', `Bearer ${token}`)
            .send({ pokemons: [] });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Team name is required' });
    });

    it('PUT /:id should return 404 when team is not found', async () => {
        (teamService.updateTeam as jest.Mock).mockResolvedValue(null);

        const response = await request(app)
            .put('/404')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Updated', pokemons: [] });

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Team not found' });
    });

    it('DELETE /:id should return 204', async () => {
        (teamService.deleteTeam as jest.Mock).mockResolvedValue(true);

        const response = await request(app)
            .delete('/1')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(204);
    });

    it('DELETE /:id should return 404 when team is not found', async () => {
        (teamService.deleteTeam as jest.Mock).mockResolvedValue(false);

        const response = await request(app)
            .delete('/404')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Team not found' });
    });

    it('GET / should return 500 when service fails', async () => {
        (teamService.getTeamsByUser as jest.Mock).mockRejectedValue(new Error('failure'));

        const response = await request(app)
            .get('/')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: 'Internal server error' });
    });

    it('GET /unknown should return 404 for non-existing route', async () => {
        const response = await request(app)
            .get('/unknown/route')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Route not found: GET /unknown/route' });
    });

    it('GET / should map SQL invalid input errors to 400', async () => {
        (teamService.getTeamsByUser as jest.Mock).mockRejectedValue({
            code: '22P02',
            detail: 'invalid input syntax for type integer'
        });

        const response = await request(app)
            .get('/')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Invalid input format' });
    });

    it('GET / should map SQL unique violation errors to 409', async () => {
        (teamService.getTeamsByUser as jest.Mock).mockRejectedValue({
            code: '23505',
            detail: 'duplicate key value violates unique constraint'
        });

        const response = await request(app)
            .get('/')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(409);
        expect(response.body).toEqual({ message: 'Duplicate resource' });
    });

    it('GET / should return AppError status and message', async () => {
        (teamService.getTeamsByUser as jest.Mock).mockRejectedValue(
            new AppError('Team quota reached', 429)
        );

        const response = await request(app)
            .get('/')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(429);
        expect(response.body).toEqual({ message: 'Team quota reached' });
    });
});