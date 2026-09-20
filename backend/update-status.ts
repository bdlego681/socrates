import { pool, connectDatabase } from './src/database/pool.ts';
async function run() { 
  await connectDatabase(); 
  await pool.request().query("UPDATE dbo.PurchaseOrders SET Status = 'Sent to Vendor' WHERE Status = 'Pending Admin Approval'"); 
  console.log('Updated DB'); 
  process.exit(0); 
} 
run();

