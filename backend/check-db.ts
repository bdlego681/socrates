import { pool, connectDatabase } from './src/database/pool.js';

async function run() {
  await connectDatabase();
  const r = await pool.request().query(`
    SELECT COLUMN_NAME, DATA_TYPE
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'users'
  `);
  console.log(r.recordset);
  process.exit();
}
run();

