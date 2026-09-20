import { connectDatabase, pool } from './src/database/pool.js';

async function run() {
  await connectDatabase();
  await pool.request().query("DELETE FROM dbo.Roles WHERE RoleName = 'Editor'");
  console.log('Done');
  process.exit();
}
run();

