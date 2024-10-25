export default () => ({
  app: {
    host: process.env.HOST || 'localhost',
    port: parseInt(process.env.PORT, 10) || 8000,
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'test',
  },
});
