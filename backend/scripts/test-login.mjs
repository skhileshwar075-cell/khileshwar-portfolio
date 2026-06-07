async function main(){
  const port = process.env.PORT || '8082';
  const res = await fetch(`http://localhost:${port}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@portfolio.com', password: 'Admin@123' }),
  });
  const text = await res.text();
  console.log('STATUS', res.status);
  console.log('BODY', text);
  console.log('SET-COOKIE', res.headers.get('set-cookie'));
}

main().catch(err=>{ console.error(err); process.exit(1); });
