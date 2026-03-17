import request from 'supertest';
import app from '../../src/app';
import * as teamService from '../../src/services/team';
import { signToken } from '../../src/utils/jwt';

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

    it('GET / should return empty list if no teams', async () => {
        (teamService.getTeamsByUser as jest.Mock).mockResolvedValue([]);

        const response = await request(app)
            .get('/')
            .set('Authorization', `Bearer ${token}`);
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });
});