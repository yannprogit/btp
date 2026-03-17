import { signToken, verifyToken } from '../../../src/utils/jwt';
import jwt from 'jsonwebtoken';

describe('JWT Utils', () => {
    const payload = { id: 1, email: 'test@example.com' };

    it('should sign a token', () => {
        const token = signToken(payload);
        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
    });

    it('should verify a token', () => {
        const token = signToken(payload);
        const decoded = verifyToken(token) as any;
        
        expect(decoded).toBeDefined();
        expect(decoded.id).toBe(payload.id);
        expect(decoded.email).toBe(payload.email);
    });

    it('should throw error for invalid token', () => {
        expect(() => verifyToken('invalid-token')).toThrow();
    });
});