const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  jobType: { type: String, enum: ["Remote", "Onsite"], required: true },
  description: { type: String, required: true },
  responsibilities: { type: [String], default: [] },
  companyLogo: { type: String }, // URL to logo image (imgbb)
  isFeatured: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);