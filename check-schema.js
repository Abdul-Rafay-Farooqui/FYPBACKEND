const { Pool } = require('pg');
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'weconnect',
  user: 'postgres',
  password: '1234'
});

async function checkSchema() {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'teacher_assignments' ORDER BY ordinal_position");
    console.log('teacher_assignments columns:');
    result.rows.forEach(r => console.log('  -', r.column_name, '(' + r.data_type + ')'));
    client.release();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}
checkSchema();
