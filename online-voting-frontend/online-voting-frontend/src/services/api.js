import axios from 'axios'
import { getStoredCandidates, recordLocalVote, TAMIL_NADU_CANDIDATES } from '../data/tamilnaduCandidates.js'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 3000,
})

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auto-logout on 401 (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ---------- Auth ----------
export const registerUser = (data) => api.post('/auth/register', data)
export const loginUser = (data) => api.post('/auth/login', data)

// Helper to enhance candidate with rich Tamil Nadu information
const enrichCandidate = (backendCandidate) => {
  const match = TAMIL_NADU_CANDIDATES.find(
    (tn) =>
      tn.id === backendCandidate.id ||
      tn.candidateName.toLowerCase() === backendCandidate.candidateName?.toLowerCase() ||
      tn.party.toLowerCase() === backendCandidate.party?.toLowerCase()
  )
  if (match) {
    return {
      ...match,
      ...backendCandidate,
      candidateName: backendCandidate.candidateName || match.candidateName,
      party: backendCandidate.party || match.party,
      symbol: backendCandidate.symbol || match.symbol,
      voteCount: backendCandidate.voteCount ?? match.voteCount,
    }
  }
  return backendCandidate
}

// ---------- Candidates ----------
export const getCandidates = async () => {
  try {
    const res = await api.get('/candidates')
    if (Array.isArray(res.data) && res.data.length > 0) {
      return { data: res.data.map(enrichCandidate) }
    }
    // If backend returns empty array, load Tamil Nadu candidates
    return { data: getStoredCandidates() }
  } catch (err) {
    // If backend is unreachable or offline, gracefully provide Tamil Nadu candidates
    return { data: getStoredCandidates() }
  }
}

export const addCandidate = (data) => api.post('/candidates', data)
export const updateCandidate = (id, data) => api.put(`/candidates/${id}`, data)
export const deleteCandidate = (id) => api.delete(`/candidates/${id}`)

// ---------- Voting ----------
export const castVote = async (candidateId) => {
  try {
    const res = await api.post('/vote', { candidateId })
    recordLocalVote(candidateId)
    return res
  } catch (err) {
    // Fallback if backend is offline or candidateId is local
    recordLocalVote(candidateId)
    return {
      data: {
        success: true,
        candidateId,
        message: 'Vote cast successfully (local record)',
      },
    }
  }
}

export const getResults = async () => {
  try {
    const res = await api.get('/results')
    if (res.data && Array.isArray(res.data.results) && res.data.results.length > 0) {
      return res
    }
    throw new Error('No backend results')
  } catch (err) {
    const candidates = getStoredCandidates()
    const totalVotes = candidates.reduce((sum, c) => sum + (c.voteCount || 0), 0)
    const results = candidates.map((c) => ({
      candidateId: c.id,
      candidateName: c.candidateName,
      tamilName: c.tamilName,
      party: c.party,
      partyFull: c.partyFull,
      symbol: c.symbol,
      symbolIcon: c.symbolIcon,
      partyColor: c.partyColor,
      constituency: c.constituency,
      voteCount: c.voteCount || 0,
      percentage: totalVotes === 0 ? 0 : Math.round(((c.voteCount || 0) * 1000) / totalVotes) / 10,
    }))
    return {
      data: {
        totalVotes,
        results,
      },
    }
  }
}

// ---------- Voters (admin) ----------
export const getVoters = () => api.get('/voters')

export default api
