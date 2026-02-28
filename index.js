require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const jobsRouter = require('./routes/jobs')
const applicationsRouter = require('./routes/applications')
const adminRouter = require('./routes/admin')

const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/jobs', jobsRouter)
app.use('/api/applications', applicationsRouter)
app.use('/api/admin', adminRouter)

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB (qtec database)')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch(err => console.error('MongoDB connection error:', err))
