import mongoose from 'mongoose'
const Schema = mongoose.Schema

const configurationSchema = new Schema({
  idProject: {
    type: String,
    required: true,
    unique: true
  },
  W3C: {
    type: String,
    required: true
  },
  carbon: {
    type: String,
    required: true
  }
})

const configuration = mongoose.model('configurations', configurationSchema)
export default configuration
