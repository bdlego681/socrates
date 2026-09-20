import { pool, connectDatabase } from './src/database/pool.ts';
async function run() { 
  await connectDatabase(); 
  const result = await pool.request().query("SELECT COLUMN_DEFAULT, COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'PurchaseOrders'"); 
  console.log(result.recordset); 
  process.exit(0); 
} 
run();

