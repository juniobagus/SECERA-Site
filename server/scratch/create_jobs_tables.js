require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const db = require('../db');

async function migrate() {
  try {
    console.log('Starting migration: jobs and job_applications');

    // 1. Create jobs table
    await db.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        department VARCHAR(100) NOT NULL,
        location VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL, -- Full-time, Part-time, Internship, Freelance
        salary_range VARCHAR(100),
        description TEXT, -- Markdown or plain text
        requirements TEXT, -- Markdown or plain text
        benefits TEXT, -- Markdown or plain text
        status VARCHAR(20) DEFAULT 'active', -- active, closed
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Jobs table created/verified');

    // 2. Create job_applications table
    await db.query(`
      CREATE TABLE IF NOT EXISTS job_applications (
        id VARCHAR(36) PRIMARY KEY,
        job_id VARCHAR(36) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        resume_url TEXT NOT NULL,
        portfolio_url TEXT,
        cover_letter TEXT,
        status VARCHAR(20) DEFAULT 'pending', -- pending, reviewed, interview, rejected, accepted
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
      )
    `);
    console.log('Job Applications table created/verified');

    console.log('Migration completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
