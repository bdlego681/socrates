import { pool, connectDatabase } from '../database/pool.js';
import fs from 'fs';
import path from 'path';

async function run() {
  try {
    await connectDatabase();
    console.log('Connecting to database...');
    const sqlContent = fs.readFileSync(path.join(process.cwd(), '../database/migrations/003_activity_log.sql'), 'utf-8');
    
    // Simple split on GO or just run directly (msnodesqlv8 might need statements split or just runs it if no GOs).
    // Our script doesn't have GOs, just normal SQL.
    await pool.query(sqlContent);
    console.log('Migration 003 completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}
run();
