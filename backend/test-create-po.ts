import { pool, connectDatabase, sql } from './src/database/pool.ts';
import { createPurchaseOrder } from './src/database/queries/procurement.ts';

async function run() { 
  await connectDatabase(); 
  const p = await pool.request().query("SELECT TOP 1 ProductID FROM dbo.Products");
  const pid = p.recordset[0].ProductID;
  try {
    await createPurchaseOrder(pid, 10);
    console.log('Success');
  } catch (e) {
    console.error(e);
  }
  process.exit(0); 
} 
run();

