
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
  const { title, company, location, category, description, jobType, isFeatured, companyLogo } = req.body;
  if (!title || !company || !location || !category || !description || !jobType) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const job = new Job({
      title,
      company,
      location,
      category,
      description,
      jobType,
      isFeatured: !!isFeatured,
      companyLogo
    });
    await job.save();
    // Fetch the saved job to ensure all fields (including defaults, virtuals, etc.) are present
    const savedJob = await Job.findById(job._id).select('title company location category description jobType isFeatured companyLogo created_at');
    res.status(201).json(savedJob);
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

// PATCH /api/jobs/:id - Partially update a job (Admin)
router.patch('/:id', async (req, res) => {
  const allowedFields = ['title', 'company', 'location', 'category', 'description', 'jobType', 'isFeatured', 'companyLogo', 'responsibilities'];
  const update = {};
  for (const field of allowedFields) {
    if (field in req.body) {
      if (field === 'isFeatured') {
        update[field] = !!req.body[field];
      } else if (field === 'responsibilities') {
        // Accept array or string (split by line)
        if (Array.isArray(req.body[field])) {
          update[field] = req.body[field].map(r => r.trim()).filter(r => r.length > 0);
        } else if (typeof req.body[field] === 'string') {
          update[field] = req.body[field].split('\n').map(r => r.trim()).filter(r => r.length > 0);
        }
      } else {
        update[field] = req.body[field];
      }
    }
  }
  if (Object.keys(update).length === 0) {
    return res.status(400).json({ error: 'No valid fields provided for update' });
  }
  try {
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      update,
      {
        returnDocument: 'after', // replaces deprecated 'new: true'
        runValidators: true,
        fields: 'title company location category description jobType isFeatured companyLogo responsibilities created_at'
      }
    );
    if (!updatedJob) return res.status(404).json({ error: 'Job not found' });
    res.json(updatedJob);
  } catch (err) {
    // Provide more specific error messages
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid job ID' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(400).json({ error: 'Invalid job ID or data' });
  }
});
module.exports = router;
