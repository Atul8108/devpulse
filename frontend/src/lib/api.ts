import axios from 'axios'

const api = axios.create({
  baseURL: "https://devpulse-production-b9fc.up.railway.app",
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
