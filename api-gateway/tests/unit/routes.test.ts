describe('gateway route configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should use default targets when env variables are absent', async () => {
    delete process.env.USERS_SERVICE_URL;
    delete process.env.TEAMS_SERVICE_URL;
    delete process.env.POKEAPI_SERVICE_URL;

    const { ROUTES } = await import('../../src/routes/routes');

    expect(ROUTES.find((route) => route.url === '/users')?.proxy.target).toBe('http://user-app:5555');
    expect(ROUTES.find((route) => route.url === '/teams')?.proxy.target).toBe('http://team-app:5050');
    expect(ROUTES.find((route) => route.url === '/pokeapi')?.proxy.target).toBe('http://pokeapi-app:6000');
  });

  it('should use env targets when variables are present', async () => {
    process.env.USERS_SERVICE_URL = 'http://users-custom:7001';
    process.env.TEAMS_SERVICE_URL = 'http://teams-custom:7002';
    process.env.POKEAPI_SERVICE_URL = 'http://pokeapi-custom:7003';

    const { ROUTES } = await import('../../src/routes/routes');

    expect(ROUTES.find((route) => route.url === '/users')?.proxy.target).toBe('http://users-custom:7001');
    expect(ROUTES.find((route) => route.url === '/teams')?.proxy.target).toBe('http://teams-custom:7002');
    expect(ROUTES.find((route) => route.url === '/pokeapi')?.proxy.target).toBe('http://pokeapi-custom:7003');
  });
});