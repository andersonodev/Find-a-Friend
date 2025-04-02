import { runMigrations } from './migrations';

runMigrations()
  .then(() => {
    console.log('Database migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Database migration failed:', error);
    process.exit(1);
  });