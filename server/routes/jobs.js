const express = require('express');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');
const { authenticateAdmin } = require('../middleware/auth');

// --- PUBLIC ROUTES ---

// GET active jobs
router.get('/', async (req, res) => {
  try {
    const [jobs] = await db.query('SELECT * FROM jobs WHERE status = "active" ORDER BY created_at DESC');
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching jobs' });
  }
});

// GET single job details
router.get('/:id', async (req, res) => {
  try {
    const [jobs] = await db.query('SELECT * FROM jobs WHERE id = ?', [req.params.id]);
    if (jobs.length === 0) return res.status(404).json({ message: 'Job not found' });
    res.json(jobs[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching job details' });
  }
});

// GET single job by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const [jobs] = await db.query('SELECT * FROM jobs WHERE slug = ?', [req.params.slug]);
    if (jobs.length === 0) return res.status(404).json({ message: 'Job not found' });
    res.json(jobs[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching job by slug' });
  }
});

// POST apply for job
router.post('/:id/apply', async (req, res) => {
  const { full_name, email, phone, resume_url, portfolio_url, cover_letter } = req.body;
  const jobId = req.params.id;
  const id = uuidv4();

  try {
    // Check if job exists and is active
    const [jobs] = await db.query('SELECT status FROM jobs WHERE id = ?', [jobId]);
    if (jobs.length === 0 || jobs[0].status !== 'active') {
      return res.status(400).json({ message: 'Job is no longer active' });
    }

    await db.query(
      'INSERT INTO job_applications (id, job_id, full_name, email, phone, resume_url, portfolio_url, cover_letter) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, jobId, full_name, email, phone, resume_url, portfolio_url || null, cover_letter || null]
    );

    res.status(201).json({ message: 'Application submitted successfully', applicationId: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error submitting application' });
  }
});


// --- ADMIN ROUTES ---

// GET all jobs for admin
router.get('/admin/all', authenticateAdmin, async (req, res) => {
  try {
    const [jobs] = await db.query('SELECT * FROM jobs ORDER BY created_at DESC');
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching admin jobs' });
  }
});

// POST create job
router.post('/', authenticateAdmin, async (req, res) => {
  const { 
    title, department, location, type, salary_range, description, requirements, benefits,
    slug, seo_title, seo_description, og_image_url
  } = req.body;
  const id = uuidv4();

  try {
    // Generate slug if not provided
    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + id.substring(0, 4);

    await db.query(
      'INSERT INTO jobs (id, title, slug, department, location, type, salary_range, description, requirements, benefits, seo_title, seo_description, og_image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        id, title, finalSlug, department, location, type, salary_range || null, description, requirements, 
        benefits || null, seo_title || null, seo_description || null, og_image_url || null
      ]
    );
    res.status(201).json({ message: 'Job created successfully', jobId: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating job' });
  }
});

// PUT update job
router.put('/:id', authenticateAdmin, async (req, res) => {
  const { 
    title, department, location, type, salary_range, description, requirements, benefits, status,
    slug, seo_title, seo_description, og_image_url
  } = req.body;
  const id = req.params.id;

  try {
    await db.query(
      'UPDATE jobs SET title=?, slug=?, department=?, location=?, type=?, salary_range=?, description=?, requirements=?, benefits=?, status=?, seo_title=?, seo_description=?, og_image_url=? WHERE id=?',
      [
        title, slug, department, location, type, salary_range, description, requirements, benefits, status, 
        seo_title || null, seo_description || null, og_image_url || null, id
      ]
    );
    res.json({ message: 'Job updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating job' });
  }
});

// DELETE job
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM jobs WHERE id = ?', [req.params.id]);
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting job' });
  }
});

// GET all applications
router.get('/admin/applications', authenticateAdmin, async (req, res) => {
  try {
    const [apps] = await db.query(`
      SELECT ja.*, j.title as job_title 
      FROM job_applications ja 
      JOIN jobs j ON ja.job_id = j.id 
      ORDER BY ja.created_at DESC
    `);
    res.json(apps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching applications' });
  }
});

// GET single application details
router.get('/admin/applications/:id', authenticateAdmin, async (req, res) => {
  try {
    const [apps] = await db.query(`
      SELECT ja.*, j.title as job_title, j.department as job_department
      FROM job_applications ja 
      JOIN jobs j ON ja.job_id = j.id 
      WHERE ja.id = ?
    `, [req.params.id]);
    
    if (apps.length === 0) return res.status(404).json({ message: 'Application not found' });
    res.json(apps[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching application details' });
  }
});

// PATCH update application status
router.patch('/admin/applications/:id', authenticateAdmin, async (req, res) => {
  const { status } = req.body;
  try {
    await db.query('UPDATE job_applications SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Application status updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating application status' });
  }
});

module.exports = router;
