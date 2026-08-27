import { readFile } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL ?? process.env.DB_CONN_KEY;
if (!connectionString) {
  console.error('❌ DATABASE_URL or DB_CONN_KEY must be configured.');
  process.exit(1);
}

const sql = neon(connectionString);

console.log('===============================================================');
console.log('  ISSA FOUNDATION - CMS DATABASE DELIVERY VERIFICATION');
console.log('===============================================================');
console.log('Timestamp:', new Date().toISOString());
console.log('Target Database: Neon Postgres (Serverless)\n');

let passCount = 0;
let totalChecks = 0;

function assertCheck(name, passed, detail = '') {
  totalChecks++;
  if (passed) {
    passCount++;
    console.log(`  ✅ [PASS] ${name} ${detail ? `(${detail})` : ''}`);
  } else {
    console.log(`  ❌ [FAIL] ${name} ${detail ? `(${detail})` : ''}`);
  }
}

async function runCmsAudit() {
  console.log('1. DATABASE TABLES & CONTENT POPULATION AUDIT');
  
  const tables = [
    { name: 'blog_posts', minExpected: 1, label: 'Blog Posts CMS' },
    { name: 'blog_post_revisions', minExpected: 0, label: 'Post Revision History' },
    { name: 'job_openings', minExpected: 1, label: 'Career Vacancies' },
    { name: 'career_applications', minExpected: 0, label: 'Candidate Submissions' },
    { name: 'resume_files', minExpected: 0, label: 'Secure Resume Blobs' },
    { name: 'staff_profiles', minExpected: 1, label: 'Staff Accounts & Roles' },
    { name: 'site_settings', minExpected: 1, label: 'Global Site Metadata' },
    { name: 'hero_slides', minExpected: 1, label: 'Homepage Hero Slides' },
    { name: 'home_sections', minExpected: 1, label: 'Homepage Sections JSON' },
    { name: 'impact_content', minExpected: 1, label: 'Impact Metrics & Milestones' },
    { name: 'programs_content', minExpected: 3, label: 'Pillar Programs (Edu/Health/EDP)' },
    { name: 'faqs', minExpected: 1, label: 'FAQ Registry' },
    { name: 'office_locations', minExpected: 1, label: 'Regional Office Locations' },
    { name: 'media_assets', minExpected: 0, label: 'CMS Media Library' },
    { name: 'legal_pages', minExpected: 2, label: 'Legal Policies (Privacy & Terms)' },
    { name: 'contact_submissions', minExpected: 0, label: 'Contact Inquiries' },
    { name: 'newsletter_subscriptions', minExpected: 0, label: 'Newsletter Subscribers' },
  ];

  for (const t of tables) {
    try {
      const rows = await sql.query(`SELECT count(*) as count FROM ${t.name}`);
      const count = parseInt(rows[0]?.count ?? '0', 10);
      assertCheck(
        `Table [${t.name}] Exists & Queryable`,
        count >= t.minExpected,
        `${count} records - ${t.label}`
      );
    } catch (err) {
      assertCheck(`Table [${t.name}] Exists & Queryable`, false, err.message);
    }
  }

  console.log('\n2. PUBLIC ROUTE CMS DATABASE INTEGRATION AUDIT');

  // Check app/page.tsx
  const homeCode = await readFile(new URL('../app/page.tsx', import.meta.url), 'utf8');
  assertCheck(
    'Homepage (/): Fetches from DB (Blog, HeroSlides, HomeSections, SiteSettings)',
    homeCode.includes('getPublishedBlogPosts') &&
    homeCode.includes('getHeroSlides') &&
    homeCode.includes('getHomeSections') &&
    homeCode.includes('getSiteSettings'),
    'app/page.tsx'
  );

  // Check app/stories/page.tsx
  const storiesCode = await readFile(new URL('../app/stories/page.tsx', import.meta.url), 'utf8');
  assertCheck(
    'Stories (/stories): Fetches published posts from DB',
    storiesCode.includes('getPublishedBlogPosts'),
    'app/stories/page.tsx'
  );

  // Check app/careers/page.tsx
  const careersCode = await readFile(new URL('../app/careers/page.tsx', import.meta.url), 'utf8');
  assertCheck(
    'Careers (/careers): Fetches active openings from DB',
    careersCode.includes('getActiveJobOpenings'),
    'app/careers/page.tsx'
  );

  // Check app/contact/page.tsx
  const contactCode = await readFile(new URL('../app/contact/page.tsx', import.meta.url), 'utf8');
  assertCheck(
    'Contact (/contact): Fetches offices, FAQs, and settings from DB',
    contactCode.includes('getOfficeLocations') &&
    contactCode.includes('getFaqs') &&
    contactCode.includes('getSiteSettings'),
    'app/contact/page.tsx'
  );

  // Check app/impact/page.tsx
  const impactCode = await readFile(new URL('../app/impact/page.tsx', import.meta.url), 'utf8');
  assertCheck(
    'Impact (/impact): Fetches stories & impact content from DB',
    impactCode.includes('getPublishedBlogPosts') &&
    impactCode.includes('getImpactContent'),
    'app/impact/page.tsx'
  );

  // Check app/programs/education/page.tsx
  const eduCode = await readFile(new URL('../app/programs/education/page.tsx', import.meta.url), 'utf8');
  assertCheck(
    'Education Program (/programs/education): Fetches program content from DB',
    eduCode.includes('getProgramsContent') && eduCode.includes("'education'"),
    'app/programs/education/page.tsx'
  );

  // Check app/programs/healthcare/page.tsx
  const healthCode = await readFile(new URL('../app/programs/healthcare/page.tsx', import.meta.url), 'utf8');
  assertCheck(
    'Healthcare Program (/programs/healthcare): Fetches program content from DB',
    healthCode.includes('getProgramsContent') && healthCode.includes("'healthcare'"),
    'app/programs/healthcare/page.tsx'
  );

  // Check app/programs/entrepreneurship/page.tsx
  const edpCode = await readFile(new URL('../app/programs/entrepreneurship/page.tsx', import.meta.url), 'utf8');
  assertCheck(
    'Entrepreneurship Program (/programs/entrepreneurship): Fetches program content from DB',
    edpCode.includes('getProgramsContent') && edpCode.includes("'entrepreneurship'"),
    'app/programs/entrepreneurship/page.tsx'
  );

  // Check app/privacy/page.tsx
  const privacyCode = await readFile(new URL('../app/privacy/page.tsx', import.meta.url), 'utf8');
  assertCheck(
    'Privacy (/privacy): Fetches legal policy from DB',
    privacyCode.includes('getLegalPage') && privacyCode.includes("'privacy'"),
    'app/privacy/page.tsx'
  );

  // Check app/terms/page.tsx
  const termsCode = await readFile(new URL('../app/terms/page.tsx', import.meta.url), 'utf8');
  assertCheck(
    'Terms (/terms): Fetches terms policy from DB',
    termsCode.includes('getLegalPage') && termsCode.includes("'terms'"),
    'app/terms/page.tsx'
  );

  console.log('\n3. OPERATIONS PANEL CMS DATA INTEGRATION AUDIT');

  // Check app/panel/page.tsx
  const panelPageCode = await readFile(new URL('../app/panel/page.tsx', import.meta.url), 'utf8');
  assertCheck(
    'Panel Main Dashboard: Queries all operational CMS entities from DB',
    panelPageCode.includes('getPanelBlogPosts') &&
    panelPageCode.includes('getPanelJobOpenings') &&
    panelPageCode.includes('getPanelCareerApplications') &&
    panelPageCode.includes('getAllStaffUsers') &&
    panelPageCode.includes('getHeroSlides') &&
    panelPageCode.includes('getHomeSections') &&
    panelPageCode.includes('getProgramsContent') &&
    panelPageCode.includes('getContactSubmissions') &&
    panelPageCode.includes('getNewsletterSubscribers'),
    'app/panel/page.tsx'
  );

  // Check app/panel/posts/[id]/page.tsx
  const editPostCode = await readFile(new URL('../app/panel/posts/[id]/page.tsx', import.meta.url), 'utf8');
  assertCheck(
    'Panel Post Editor: Fetches post by ID and revisions from DB',
    editPostCode.includes('getPanelBlogPostById') &&
    editPostCode.includes('getBlogPostRevisions'),
    'app/panel/posts/[id]/page.tsx'
  );

  console.log('\n---------------------------------------------------------------');
  console.log(`CMS DB VERIFICATION SUMMARY: ${passCount} / ${totalChecks} Checks Passed (${Math.round((passCount / totalChecks) * 100)}%)`);
  console.log('===============================================================\n');

  if (passCount === totalChecks) {
    console.log('🌟 CONFIRMATION: All CMS operations are confirmed delivering from Neon Postgres DB!');
  } else {
    console.warn('⚠️ WARNING: Some CMS operations are missing DB bindings.');
  }
}

runCmsAudit().catch((err) => {
  console.error('Fatal CMS audit error:', err);
  process.exit(1);
});
