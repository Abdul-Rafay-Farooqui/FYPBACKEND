const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'weconnect',
  user: 'postgres',
  password: '1234'
});

async function createTeacherAssignments() {
  try {
    const client = await pool.connect();
    
    // The teacher who has grades
    const teacherId = '13fb70e5-2956-4c58-9164-d4906cbb0758';
    
    // The subjects that have grades
    const subjectIds = [
      '317fb40b-3a2b-440e-9987-ae32853363d8',
      '4d10b2c5-23bc-4c6b-85a9-6c34db78eafd'
    ];
    
    // Get institute ID from teacher
    const teacherResult = await client.query('SELECT institute_id FROM users WHERE id = $1', [teacherId]);
    if (teacherResult.rows.length === 0) {
      console.log('❌ Teacher not found');
      process.exit(1);
    }
    
    const instituteId = teacherResult.rows[0].institute_id;
    console.log('👨‍🏫 Teacher found, institute:', instituteId);
    
    // Insert teacher assignments for each subject
    for (const subjectId of subjectIds) {
      const assignmentId = uuidv4();
      const taQuery = `
        INSERT INTO teacher_assignments (id, teacher_id, subject_id, institute_id, created_at, updated_at)
        VALUES ($1, $2, $3, $4, NOW(), NOW())
        ON CONFLICT DO NOTHING
      `;
      await client.query(taQuery, [assignmentId, teacherId, subjectId, instituteId]);
      console.log('✅ Created teacher assignment:', assignmentId);
    }
    
    // Verify
    const verify = await client.query('SELECT COUNT(*) as total FROM teacher_assignments WHERE teacher_id = $1', [teacherId]);
    console.log('📊 Teacher now has', verify.rows[0].total, 'subject assignments');
    
    client.release();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

createTeacherAssignments();
