const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_NAME || 'weconnect',
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected successfully!');

    const migrationPath = path.join(__dirname, 'migrations', 'add_institutes.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('Running migration...');
    await client.query(sql);
    console.log('Migration completed successfully!');

    // Verify tables were created
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('institutes', 'institute_members')
      ORDER BY table_name;
    `);

    console.log('\nCreated tables:');
    result.rows.forEach(row => {
      console.log(`  ✓ ${row.table_name}`);
    });

    // Check if columns were added
    const columnsResult = await client.query(`
      SELECT table_name, column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND column_name = 'institute_id'
      AND table_name IN ('classes', 'batches', 'sections', 'subjects')
      ORDER BY table_name;
    `);

    console.log('\nAdded institute_id columns to:');
    columnsResult.rows.forEach(row => {
      console.log(`  ✓ ${row.table_name}`);
    });

  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Load environment variables
require('dotenv').config();

runMigration();
