import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL ?? process.env.DB_CONN_KEY;
if (!connectionString) {
  console.error('No DB connection string.');
  process.exit(1);
}

const sql = neon(connectionString);

async function checkAllTables() {
  console.log('=== Neon Postgres Database CMS Content Audit ===\n');

  const tables = [
    'blog_posts',
    'blog_post_revisions',
    'job_openings',
    'career_applications',
    'resume_files',
    'staff_profiles',
    'site_settings',
    'hero_slides',
    'home_sections',
    'impact_content',
    'programs_content',
    'faqs',
    'office_locations',
    'media_assets',
    'legal_pages',
    'contact_submissions',
    'newsletter_subscriptions'
  ];

  for (const table of tables) {
    try {
      const rows = await sql.query(`SELECT count(*) as count FROM ${table}`);
      console.log(`✓ Table [${table}]: ${rows[0].count} records`);
    } catch (err) {
      console.log(`✗ Table [${table}]: ERROR or Missing (${err.message})`);
    }
  }
}

checkAllTables().catch(console.error);
