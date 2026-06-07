import pg from 'pg';

const { Client } = pg;

async function main() {
  const adminUrl = process.env.ADMIN_DATABASE_URL || process.argv[2];
  const dbName = process.env.TARGET_DB_NAME || process.argv[3] || 'khileshwar_portfolio';

  if (!adminUrl) {
    console.error('ADMIN_DATABASE_URL is required (env or first arg)');
    process.exit(1);
  }

  const client = new Client({ connectionString: adminUrl });
  await client.connect();

  try {
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
    if (res.rowCount > 0) {
      console.log(`Database '${dbName}' already exists.`);
    } else {
      console.log(`Creating database '${dbName}'...`);
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log('Database created.');
    }
  } catch (err) {
    console.error('Error creating database:', err.message || err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
