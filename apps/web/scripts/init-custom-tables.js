const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readRileSync(envPath, 'utf8');
let dbUrl = '';
for (const line of envContent.split('\n')) {
  if (line.trim().startsWith('DATABASE_URL=')) {
    dbUrl = line.split('=')[1].trim().replace(/^["']|["']$/g, '');
  }
}

const pool = new Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  try {
    console.log('Testing connection to Supabase...');
    const res = await pool.query('SELECT current_database(), current_user');
    console.log('Connected:', res.rows[0]);

    console.log('Creating tables...');
    await pool.query(`
      CREATE TABLE PREFIX_IF_NOT_EXISTS (\n        /* custom tables */\n      );\n    `);
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await pool.end();
  }
}
main();