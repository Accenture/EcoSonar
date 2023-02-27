const mongoose = require('mongoose')
const Schema = mongoose.Schema

const projectsSchema = new Schema({
  projectName: {
    type: String,
    required: true
  },
  procedure: {
    type: String,
    enum: ['quickWins', 'highestImpact', 'scoreImpact']
  },
  login: {
    type: Map
  },
  proxy: {
    ipAddress: {
      type: String
    },
    port: {
      type: String
    }
  }
})

const project = mongoose.model('projects', projectsSchema)
module.exports = project
