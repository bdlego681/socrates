import { connectDatabase } from './src/database/pool.js';
import { inviteUser } from './src/database/queries/users.js';

async function run() {
  await connectDatabase();
  try {
    const token = await inviteUser('testinvite2@example.com', 1);
    console.log('Invite successful, token:', token);
  } catch (err) {
    console.error('Invite error:', err);
  }
  process.exit();
}
run();

