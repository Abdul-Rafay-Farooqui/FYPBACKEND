const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: "school_cms",
  user: "postgres",
  password: "postgres",
});

async function runMigration() {
  try {
    console.log("Connecting to database...");
    const client = await pool.connect();

    console.log("Dropping foreign key constraint...");
    await client.query(
      'ALTER TABLE "results" DROP CONSTRAINT IF EXISTS "results_class_batch_section_id_fkey"',
    );
    console.log("✅ Foreign key constraint dropped");

    console.log("Making class_batch_section_id nullable...");
    await client.query(
      'ALTER TABLE "results" ALTER COLUMN "class_batch_section_id" DROP NOT NULL',
    );
    console.log("✅ Column made nullable");

    console.log("✅ Migration completed successfully!");
    client.release();
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
    process.exit(1);
  }
}

runMigration();
