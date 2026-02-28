const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

// GET /api/jobs - List all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/jobs/:id - Get single job details
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(400).json({ error: 'Invalid job ID' });
  }
});

// POST /api/jobs - Create a job (Admin)
router.post('/', async (req, res) => {
  const { title, company, location, category, description } = req.body;
  if (!title || !company || !location || !category || !description) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const job = new Job({ title, company, location, category, description });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/jobs/:id - Delete a job (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid job ID' });
  }
});

module.exports = router;
