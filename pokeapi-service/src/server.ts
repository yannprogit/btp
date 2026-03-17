import app from './app';

const port = process.env.API_PORT || 6000;

app.listen(6000, '0.0.0.0', () => {
  console.log(`Running on http://0.0.0.0:${port}`);
});
