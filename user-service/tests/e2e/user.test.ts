import request from 'supertest';
import app from '../../src/app';
import * as userService from '../../src/services/user';
import { signToken } from '../../src/utils/jwt';

jest.mock('../../src/services/user');
jest.mock('../../src/init/initDB', () => ({
    initDB: jest.fn(),
}));

describe('User Service E2E (Mocked DB)', () => {
    let token: string;

    beforeAll(() => {
        token = signToken({ id: 1, email: 'test@example.com' });
    });

    it('GET / should return a list of users', async () => {
        const mockUsers = [
            { id: 1, name: 'Alice', email: 'alice@example.com' },
            { id: 2, name: 'Bob', email: 'bob@example.com' },
        ];

        (userService.getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

        const response = await request(app)
            .get('/')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUsers);
        expect(userService.getAllUsers).toHaveBeenCalledTimes(1);
    });

    it('GET / should require authentication', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(401);
    });

    it('GET /users/me should return current user profile', async () => {
        const mockUser = { id: 1, name: 'Alice', email: 'alice@example.com' };
        
        (userService.getUserById as jest.Mock).mockResolvedValue(mockUser);

        const response = await request(app)
            .get('/me') 
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUser);
    });
});
