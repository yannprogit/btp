import { signToken, verifyToken } from '../../../src/utils/jwt';

describe('JWT Utils (Team Service)', () => {
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
    });
});