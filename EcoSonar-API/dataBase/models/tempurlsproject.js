import mongoose from 'mongoose'
const Schema = mongoose.Schema

const tempUrlsProjectSchema = new Schema({
  idKey: {
    type: String,
    required: true,
    unique: true
  },
  projectName: {
    type: String,
    required: true,
    unique: true
  },
  urlsList: [String]
})

const tempurlsProject = mongoose.model('tempurlsprojects', tempUrlsProjectSchema)
export default tempurlsProject
