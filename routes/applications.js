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



// JWT admin role middleware
const jwt = require('jsonwebtoken');
function adminOnly(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing or malformed' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    if (decoded.role === 'admin') {
      req.admin = decoded;
      return next();
    } else {
      return res.status(403).json({ error: 'Forbidden: Admins only' });
    }
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// GET /api/applications - Admin: Get all applications with job details
router.get('/', adminOnly, async (req, res) => {
  try {
    const applications = await Application.find().populate({
      path: 'job_id',
      select: 'title company location jobType category',
    }).sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
