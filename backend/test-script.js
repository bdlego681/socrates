import fetch from 'node-fetch';

async function test() {
  const res = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: 'admin@socrates.local', password: 'Password123!' })
  });
  const cookie = res.headers.raw()['set-cookie'];
  console.log('cookie', cookie);

  const res2 = await fetch('http://localhost:3000/api/procurement/tasks', {
    headers: { 'Cookie': cookie[0] }
  });
  console.log('tasks', await res2.text());
}
test();

