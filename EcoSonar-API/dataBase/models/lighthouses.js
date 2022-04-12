const mongoose = require('mongoose')
const Schema = mongoose.Schema

const lighthouseSchema = new Schema({
  idLighthouseAnalysis: {
    type: String,
    required: true,
    unique: true
  },
  idUrlLighthouse: {
    type: String,
    required: true
  },
  dateLighthouseAnalysis: {
    type: Date,
    required: true
  },
  performance: {
    type: JSON,
    required: true
  },
  accessibility: {
    type: JSON,
    required: true
  },
  largestContentfulPaint: {
    type: JSON,
    required: true
  },
  cumulativeLayoutShift: {
    type: JSON,
    required: true
  },
  firstContentfulPaint: {
    type: JSON,
    required: true
  },
  speedIndex: {
    type: JSON,
    required: true
  },
  totalBlockingTime: {
    type: JSON,
    required: true
  },
  interactive: {
    type: JSON,
    required: true
  }
})

const lighthouse = mongoose.model('lighthouses', lighthouseSchema)
module.exports = lighthouse
