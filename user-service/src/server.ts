import app from './app';

const port = process.env.API_PORT || 5555;

const startServer = async () => {
  app.listen(5555, '0.0.0.0', () => {
    console.log(`Running on http://0.0.0.0:${port}`);
  });
};

startServer();
