import axios from 'axios'

const baseUrlHosted = process.env.REACT_APP_BASE_URL_ECOSONAR_API || ''

export const axiosInstance = axios.create({
  baseURL: baseUrlHosted,
  timeout: 15000
})
