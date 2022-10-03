const mongoose = require('mongoose')
const Schema = mongoose.Schema

const greenItSchema = new Schema({
  idGreenAnalysis: {
    type: String,
    required: true,
    unique: true
  },
  idUrlGreen: {
    type: String,
    required: true
  },
  dateGreenAnalysis: {
    type: Date,
    required: true
  },
  domSize: {
    type: Number,
    required: true
  },
  nbRequest: {
    type: Number,
    required: true
  },
  responsesSize: {
    type: Number,
    required: true
  },
  responsesSizeUncompress: {
    type: Number,
    required: true
  },
  ecoIndex: {
    type: Number,
    required: true
  },
  grade: {
    type: String,
    required: true
  }
})

const greenIt = mongoose.model('greenits', greenItSchema)
module.exports = greenIt
