import { useEffect, useState } from 'react'
import { getCandidates, addCandidate, updateCandidate, deleteCandidate, getVoters } from '../services/api.js'

const emptyForm = { candidateName: '', party: '', symbol: '' }

export default function AdminDashboard() {
  const [candidates, setCandidates] = useState([])
  const [voters, setVoters] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const loadCandidates = () => {
    getCandidates().then((res) => setCandidates(res.data)).catch(() => setError('Failed to load candidates'))
  }

  useEffect(() => {
    loadCandidates()
    getVoters().then((res) => setVoters(res.data)).catch(() => {})
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editingId) {
        await updateCandidate(editingId, form)
      } else {
        await addCandidate(form)
      }
      setForm(emptyForm)
      setEditingId(null)
      loadCandidates()
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed')
    }
  }

  const handleEdit = (c) => {
    setEditingId(c.id)
    setForm({ candidateName: c.candidateName, party: c.party || '', symbol: c.symbol || '' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this candidate?')) return
    try {
      await deleteCandidate(id)
      loadCandidates()
    } catch (err) {
      setError('Failed to delete candidate')
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm(emptyForm)
  }

  return (
    <div className="page container">
      <h2>Admin Dashboard</h2>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <h3>{editingId ? 'Edit Candidate' : 'Add Candidate'}</h3>
        <form onSubmit={handleSubmit}>
          <label>Candidate Name</label>
          <input name="candidateName" value={form.candidateName} onChange={handleChange} required />

          <label>Party</label>
          <input name="party" value={form.party} onChange={handleChange} />

          <label>Symbol</label>
          <input name="symbol" value={form.symbol} onChange={handleChange} />

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-primary" type="submit">{editingId ? 'Update' : 'Add'} Candidate</button>
            {editingId && <button type="button" className="btn btn-outline" onClick={cancelEdit}>Cancel</button>}
          </div>
        </form>
      </div>

      <h3>Candidates ({candidates.length})</h3>
      <table className="table">
        <thead>
          <tr><th>Name</th><th>Party</th><th>Symbol</th><th>Votes</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {candidates.map((c) => (
            <tr key={c.id}>
              <td>{c.candidateName}</td>
              <td>{c.party}</td>
              <td>{c.symbol}</td>
              <td>{c.voteCount}</td>
              <td>
                <button className="btn-link" onClick={() => handleEdit(c)}>Edit</button>{' '}
                <button className="btn-link danger" onClick={() => handleDelete(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Registered Voters ({voters.length})</h3>
      <table className="table">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Voted</th></tr>
        </thead>
        <tbody>
          {voters.filter(v => v.role === 'VOTER').map((v) => (
            <tr key={v.id}>
              <td>{v.name}</td>
              <td>{v.email}</td>
              <td>{v.voted ? '✅' : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
