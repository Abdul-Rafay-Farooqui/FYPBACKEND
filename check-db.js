const { Pool } = require('pg');
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'weconnect',
  user: 'postgres',
  password: '1234'
});

async function checkResults() {
  try {
    const client = await pool.connect();
    
    // Check if results table has any data
    const results = await client.query('SELECT COUNT(*) as total FROM results');
    console.log('📊 Total results in database:', results.rows[0].total);
    
    // Check recent results
    const recent = await client.query('SELECT r.id, r.student_id, r.teacher_id, r.subject_id, r.result_type, r.marks_obtained, r.total_marks, r.grade FROM results r ORDER BY r.published_date DESC LIMIT 5');
    console.log('📋 Recent results:', JSON.stringify(recent.rows, null, 2));
    
    // Check if teacher_assignments exist
    const ta = await client.query('SELECT COUNT(*) as total FROM teacher_assignments');
    console.log('👨‍🏫 Teacher assignments count:', ta.rows[0].total);
    
    // Check course enrollments
    const ce = await client.query('SELECT COUNT(*) as total FROM course_enrollments');
    console.log('📚 Course enrollments count:', ce.rows[0].total);
    
    client.release();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

checkResults();
