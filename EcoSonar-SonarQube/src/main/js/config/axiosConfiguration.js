const axios = require('axios')

const baseUrlHosted = '<BASE_URL_OF_ECOSONAR_API>'

export const axiosInstance = axios.create({
  baseURL: baseUrlHosted,
  timeout: 15000
})
