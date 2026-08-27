import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('all public pages fetch dynamic CMS content from DB modules', async () => {
  const [home, stories, careers, contact, impact, edu, health, edp, privacy, terms] = await Promise.all([
    readFile(new URL('../app/page.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../app/stories/page.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../app/careers/page.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../app/contact/page.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../app/impact/page.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../app/programs/education/page.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../app/programs/healthcare/page.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../app/programs/entrepreneurship/page.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../app/privacy/page.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../app/terms/page.tsx', import.meta.url), 'utf8'),
  ]);

  // Homepage
  assert.match(home, /getPublishedBlogPosts/);
  assert.match(home, /getHeroSlides/);
  assert.match(home, /getHomeSections/);
  assert.match(home, /getSiteSettings/);

  // Stories
  assert.match(stories, /getPublishedBlogPosts/);

  // Careers
  assert.match(careers, /getActiveJobOpenings/);

  // Contact
  assert.match(contact, /getOfficeLocations/);
  assert.match(contact, /getFaqs/);
  assert.match(contact, /getSiteSettings/);

  // Impact
  assert.match(impact, /getPublishedBlogPosts/);
  assert.match(impact, /getImpactContent/);

  // Programs
  assert.match(edu, /getProgramsContent/);
  assert.match(health, /getProgramsContent/);
  assert.match(edp, /getProgramsContent/);

  // Legal
  assert.match(privacy, /getLegalPage/);
  assert.match(terms, /getLegalPage/);
});

test('operations panel fetches live DB data across all submodules', async () => {
  const panel = await readFile(new URL('../app/panel/page.tsx', import.meta.url), 'utf8');
  assert.match(panel, /getPanelBlogPosts/);
  assert.match(panel, /getPanelJobOpenings/);
  assert.match(panel, /getPanelCareerApplications/);
  assert.match(panel, /getAllStaffUsers/);
  assert.match(panel, /getSiteSettings/);
  assert.match(panel, /getHeroSlides/);
  assert.match(panel, /getHomeSections/);
  assert.match(panel, /getImpactContent/);
  assert.match(panel, /getProgramsContent/);
  assert.match(panel, /getFaqs/);
  assert.match(panel, /getOfficeLocations/);
  assert.match(panel, /getContactSubmissions/);
  assert.match(panel, /getNewsletterSubscribers/);
});
