const mongoose = require('mongoose')
const Schema = mongoose.Schema

const w3cSchema = new Schema({
  idW3cAnalysis: {
    type: String,
    required: true,
    unique: true
  },
  idUrlW3c: { type: String, required: true },
  dateW3cAnalysis: { type: Date, required: true },
  score: { type: Number, required: true },
  w3cBestPractices: { type: Object, required: true }
})

const w3cs = mongoose.model('w3cs', w3cSchema)
module.exports = w3cs
