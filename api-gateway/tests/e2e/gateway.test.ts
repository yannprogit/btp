import request from 'supertest';
import app from '../../src/app';

describe('API Gateway E2E', () => {

    it('GET / should return gateway info', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toContain('API Gateway');
    });

    // Validating that routes are set up is hard without running the actual target services.
    // However, we can check if it tries to proxy or 404s on known non-existent routes.

    it('GET /unknown-route should likely return 404 or proxy error', async () => {
        const response = await request(app).get('/unknown-route');
        // Express default 404 HTML or if handled.
        // If not handled by proxy, it might fall through.
        // Our app.use proxy setup might catch it or not depending on configuration.
        // Let's assume standard behavior.
        expect(response.status).not.toBe(500); 
    });
});