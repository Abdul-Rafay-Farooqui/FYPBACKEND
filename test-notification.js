/**
 * Test script to verify institute notifications system
 * Run with: node test-notification.js
 */

const { DataSource } = require('typeorm');
require('dotenv').config();

async function testNotifications() {
  console.log('🔍 Testing Institute Notifications System...\n');

  // Create database connection
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Database connected\n');

    // Check if institute_notifications table exists
    const tableCheck = await dataSource.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'institute_notifications'
      );
    `);

    if (!tableCheck[0].exists) {
      console.log('❌ Table "institute_notifications" does NOT exist!');
      console.log('⚠️  Please run the migration: backend/migrations/create_institute_notifications.sql\n');
      await dataSource.destroy();
      return;
    }

    console.log('✅ Table "institute_notifications" exists\n');

    // Get table structure
    const columns = await dataSource.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'institute_notifications'
      ORDER BY ordinal_position;
    `);

    console.log('📋 Table Structure:');
    columns.forEach((col) => {
      console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : ''}`);
    });
    console.log();

    // Count existing notifications
    const count = await dataSource.query(`
      SELECT COUNT(*) as count FROM institute_notifications;
    `);
    console.log(`📊 Total notifications: ${count[0].count}\n`);

    // Get recent notifications if any
    if (parseInt(count[0].count) > 0) {
      const recent = await dataSource.query(`
        SELECT id, type, title, message, read, created_at
        FROM institute_notifications
        ORDER BY created_at DESC
        LIMIT 5;
      `);
      console.log('📬 Recent Notifications:');
      recent.forEach((notif, i) => {
        console.log(`  ${i + 1}. [${notif.type}] ${notif.title}`);
        console.log(`     ${notif.message}`);
        console.log(`     ${notif.read ? '✅ Read' : '⭕ Unread'} - ${notif.created_at}`);
      });
      console.log();
    }

    console.log('✅ Notifications system is properly set up!\n');
    console.log('💡 Next steps:');
    console.log('   1. Make sure backend is running');
    console.log('   2. Create an announcement or assignment');
    console.log('   3. Check the notification bell icon in the UI');
    console.log('   4. Notifications should appear in real-time via WebSocket\n');

    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('does not exist')) {
      console.log('\n⚠️  Please run the migration: backend/migrations/create_institute_notifications.sql\n');
    }
    await dataSource.destroy();
  }
}

testNotifications();
