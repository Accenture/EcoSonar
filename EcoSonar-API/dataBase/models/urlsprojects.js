const mongoose = require('mongoose')
const Schema = mongoose.Schema

const urlsProjectSchema = new Schema({
  idKey: {
    type: String,
    required: true,
    unique: true
  },
  projectName: {
    type: String,
    required: true
  },
  urlName: {
    type: String,
    required: true,
    match: [/^(https|http):\/\/\S*$/g, 'Please fill in a valid url']
  },
  userFlow: {
    type: Map
  }
})

const urlsProject = mongoose.model('urlsprojects', urlsProjectSchema)
module.exports = urlsProject
