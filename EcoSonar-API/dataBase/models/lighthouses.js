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
    score: {
      type: Number,
      required: true
    },
    complianceLevel: {
      type: String,
      required: true
    }
  },
  accessibility: {
    score: {
      type: Number,
      required: true
    },
    complianceLevel: {
      type: String,
      required: true
    }
  },
  largestContentfulPaint: {
    displayValue: {
      type: Number,
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    complianceLevel: {
      type: String,
      required: true
    }
  },
  cumulativeLayoutShift: {
    displayValue: {
      type: Number,
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    complianceLevel: {
      type: String,
      required: true
    }
  },
  firstContentfulPaint: {
    displayValue: {
      type: Number,
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    complianceLevel: {
      type: String,
      required: true
    }
  },
  speedIndex: {
    displayValue: {
      type: Number,
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    complianceLevel: {
      type: String,
      required: true
    }
  },
  totalBlockingTime: {
    displayValue: {
      type: Number,
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    complianceLevel: {
      type: String,
      required: true
    }
  },
  interactive: {
    displayValue: {
      type: Number,
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    complianceLevel: {
      type: String,
      required: true
    }
  }
})

const lighthouse = mongoose.model('lighthouses', lighthouseSchema)
module.exports = lighthouse
