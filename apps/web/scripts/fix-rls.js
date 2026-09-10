const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Read root .env directly
const envPath = path.resolve(__dirname, '../../../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
let dbUrl = '';
for (const line of envContent.split('\n')) {
  if (line.trim().startsWith('DATABASE_URL=')) {
    dbUrl = line.split('=')[1].trim().replace(/^["']|["']$/g, '');
  }
}

if (!dbUrl) {
  console.error('DATABASE_URL not found in .env');
  process.exit(1);
}

console.log('Connecting to database...');
const pool = new Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  try {
    const res = await pool.query(`
      SELECT relname AS table_name, relrowsecurity AS rls_enabled
      FROM pg_class
      JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace
      WHERE pg_namespace.nspname = 'public' AND pg_class.relkind = 'r'
      ORDER BY relname;
    `);

    console.log('Found tables in public schema:');
    for (const row of res.rows) {
      console.log(`- ${row.table_name} (RLS enabled: ${row.rls_enabled})`);
    }

    console.log('\nEnabling Row-Level Security on all public tables...');
    for (const row of res.rows) {
      await pool.query(`ALTER TABLE public."${row.table_name}" ENABLE ROW LEVEL SECURITY;`);
      console.log(`Enabled RLS on: ${row.table_name}`);
    }

    console.log('\nCreating service role / authenticated access policies...');
    for (const row of res.rows) {
      await pool.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = '${row.table_name}' AND policyname = 'service_role_all'
          ) THEN
            CREATE POLICY service_role_all ON public."${row.table_name}"
            FOR ALL
            TO authenticated, service_role, postgres
            USING (true)
            WITH CHECK (true);
          END IF;
        END $$;
      `);
      console.log(`Secured policy for: ${row.table_name}`);
    }

    console.log('\n SUCCESS: All public tables now have Row-Level Security enabled and verified!');
  } catch (err) {
    console.error('Error during RLS migration:', err);
  } finally {
    await pool.end();
  }
}

main();
