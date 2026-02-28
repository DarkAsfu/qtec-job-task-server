const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');

function isValidEmail(email) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// POST /api/applications - Submit job application
router.post('/', async (req, res) => {
  const { job_id, name, email, resume_link, cover_note } = req.body;
  if (!job_id || !name || !email || !resume_link || !cover_note) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  if (!isValidURL(resume_link)) {
    return res.status(400).json({ error: 'Invalid resume link URL' });
  }
  try {
    const job = await Job.findById(job_id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    const application = new Application({ job_id, name, email, resume_link, cover_note });
    await application.save();
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
