import request from 'supertest';
import app from '../../src/app';
import * as userService from '../../src/services/user';
import { signToken } from '../../src/utils/jwt';
import { AppError } from '../../src/utils/errors';

jest.mock('../../src/services/user');
jest.mock('../../src/init/initDB', () => ({
    initDB: jest.fn(),
}));

describe('User Service E2E (Mocked DB)', () => {
    let token: string;

    beforeAll(() => {
        token = signToken({ id: 1, email: 'test@example.com' });
    });

    beforeEach(() => {
        jest.clearAllMocks();
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

    it('GET / should reject invalid token', async () => {
        const response = await request(app)
            .get('/')
            .set('Authorization', 'Bearer invalid-token');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Invalid token' });
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

    it('GET /me should return 404 when profile is missing', async () => {
        (userService.getUserById as jest.Mock).mockResolvedValue(null);

        const response = await request(app)
            .get('/me')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'User not found' });
    });

    it('GET /:id should return user by id', async () => {
        const mockUser = { id: 2, name: 'Bob', email: 'bob@example.com' };
        (userService.getUserById as jest.Mock).mockResolvedValue(mockUser);

        const response = await request(app)
            .get('/2')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUser);
    });

    it('GET /:id should return 404 when user is not found', async () => {
        (userService.getUserById as jest.Mock).mockResolvedValue(null);

        const response = await request(app)
            .get('/404')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'User not found' });
    });

    it('POST / should create user', async () => {
        const created = { id: 3, name: 'Charlie', email: 'charlie@example.com' };
        (userService.createUser as jest.Mock).mockResolvedValue(created);

        const response = await request(app)
            .post('/')
            .send({ name: 'Charlie', email: 'charlie@example.com', password: 'pwd' });

        expect(response.status).toBe(201);
        expect(response.body).toEqual(created);
    });

    it('POST / should return 400 when fields are missing', async () => {
        const response = await request(app)
            .post('/')
            .send({ email: 'charlie@example.com' });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Fields are missing' });
    });

    it('PUT /:id should return 204 when update succeeds', async () => {
        (userService.updateUser as jest.Mock).mockResolvedValue(true);

        const response = await request(app)
            .put('/1')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'New Name', currentPassword: 'pwd' });

        expect(response.status).toBe(204);
    });

    it('PUT /:id should return 400 when current password is missing', async () => {
        const response = await request(app)
            .put('/1')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'New Name' });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Current password is required' });
    });

    it('PUT /:id should return 403 for invalid credentials', async () => {
        (userService.updateUser as jest.Mock).mockResolvedValue(false);

        const response = await request(app)
            .put('/1')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'New Name', currentPassword: 'wrong' });

        expect(response.status).toBe(403);
        expect(response.body).toEqual({ message: 'Invalid credentials' });
    });

    it('DELETE /:id should return 204 on success', async () => {
        (userService.deleteUser as jest.Mock).mockResolvedValue(true);

        const response = await request(app)
            .delete('/1')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(204);
    });

    it('DELETE /:id should return 404 when user does not exist', async () => {
        (userService.deleteUser as jest.Mock).mockResolvedValue(false);

        const response = await request(app)
            .delete('/404')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'User not found' });
    });

    it('GET /unknown/route should return 404 for non-existing route', async () => {
        const response = await request(app)
            .get('/unknown/route')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Route not found: GET /unknown/route' });
    });

    it('GET / should map SQL invalid input errors to 400', async () => {
        (userService.getAllUsers as jest.Mock).mockRejectedValue({
            code: '22P02',
            detail: 'invalid input syntax'
        });

        const response = await request(app)
            .get('/')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Invalid input format' });
    });

    it('GET / should map SQL unique violation errors to 409', async () => {
        (userService.getAllUsers as jest.Mock).mockRejectedValue({
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
        (userService.getAllUsers as jest.Mock).mockRejectedValue(
            new AppError('Quota exceeded', 429)
        );

        const response = await request(app)
            .get('/')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(429);
        expect(response.body).toEqual({ message: 'Quota exceeded' });
    });
});
