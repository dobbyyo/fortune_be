import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  console.log('DATABASE_PORT from env:', process.env.DATABASE_PORT);
  return {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    migrations: [__dirname + '../migrations/*{.ts,.js}'],
    migrationsTableName: 'migrations',
    logging: process.env.DATABASE_LOGGING === 'true',
  };
});
