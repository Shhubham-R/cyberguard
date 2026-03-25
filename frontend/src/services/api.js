import axios from 'axios'

const API_BASE = '/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Analyze single text
export const analyzeText = async (text, apiKey = 'demo-key-123') => {
  try {
    const response = await api.post('/analyze', { text, api_key: apiKey })
    return response.data
  } catch (error) {
    console.error('Analyze error:', error)
    throw error
  }
}

// Analyze bulk texts
export const analyzeBulk = async (texts, apiKey = 'demo-key-123') => {
  try {
    const response = await api.post('/analyze/bulk', { texts, api_key: apiKey })
    return response.data
  } catch (error) {
    console.error('Bulk analyze error:', error)
    throw error
  }
}

// Get stats
export const getStats = async () => {
  try {
    const response = await api.get('/stats')
    return response.data
  } catch (error) {
    console.error('Stats error:', error)
    throw error
  }
}

// Get history
export const getHistory = async (page = 1, pageSize = 10) => {
  try {
    const response = await api.get('/history', { params: { page, page_size: pageSize } })
    return response.data
  } catch (error) {
    console.error('History error:', error)
    throw error
  }
}

// Clear history
export const clearHistory = async () => {
  try {
    const response = await api.delete('/history')
    return response.data
  } catch (error) {
    console.error('Clear history error:', error)
    throw error
  }
}

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/health')
    return response.data
  } catch (error) {
    console.error('Health check error:', error)
    throw error
  }
}

export default api
