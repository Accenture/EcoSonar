const axios = require('axios')

// implement switch environment variables according to local or Azure
//  const baseUrlLocal = 'http://localhost:3000'
const baseUrlHosted = 'https://sustainability-ecosonar-api.azurewebsites.net'

export const axiosInstance = axios.create({
  baseURL: baseUrlHosted,
  timeout: 15000
})
