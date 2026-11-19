import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCandidates } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { TAMIL_NADU_CANDIDATES } from '../data/tamilnaduCandidates.js'

export default function CandidateList() {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [partyFilter, setPartyFilter] = useState('ALL')
  const { user } = useAuth()

  useEffect(() => {
    getCandidates()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setCandidates(res.data)
        } else {
          setCandidates(TAMIL_NADU_CANDIDATES)
        }
      })
      .catch(() => {
        setCandidates(TAMIL_NADU_CANDIDATES)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="page container">Loading candidates...</div>

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      (c.candidateName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.tamilName || '').includes(searchQuery) ||
      (c.party || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.constituency || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.symbol || '').toLowerCase().includes(searchQuery.toLowerCase())

    const matchesParty =
      partyFilter === 'ALL' ? true : (c.party || '').toUpperCase() === partyFilter.toUpperCase()

    return matchesSearch && matchesParty
  })

  const uniqueParties = ['ALL', ...Array.from(new Set(candidates.map((c) => c.party).filter(Boolean)))]

  return (
    <div className="page container">
      <div className="election-banner">
        <h2>🏛️ Tamil Nadu Candidates List — Election 2026</h2>
        <p>
          Profiles, party affiliations, official election symbols, and key election manifestos for Tamil Nadu.
        </p>
        {!user?.voted && (
          <div style={{ marginTop: '16px' }}>
            <Link to="/vote" className="btn btn-primary" style={{ background: '#ffffff', color: '#312e81' }}>
              🗳️ Proceed to Cast Your Vote
            </Link>
          </div>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="🔍 Search candidate name, party, symbol, or constituency..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="filter-pills">
          {uniqueParties.map((p) => (
            <button
              key={p}
              type="button"
              className={`filter-pill ${partyFilter === p ? 'active' : ''}`}
              onClick={() => setPartyFilter(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '14px 0 6px 0' }}>
        <h3 style={{ margin: 0 }}>
          Contesting Tamil Nadu Candidates ({filteredCandidates.length})
        </h3>
      </div>

      <div className="candidates-grid">
        {filteredCandidates.map((c) => (
          <div className="candidate-card-rich" key={c.id} style={{ cursor: 'default' }}>
            <div
              className="card-top-stripe"
              style={{ background: c.partyColor || '#4f46e5' }}
            ></div>

            <div className="card-body">
              <div className="card-header-flex">
                <div className="symbol-avatar" title={`Symbol: ${c.symbol}`}>
                  {c.symbolIcon || '🗳️'}
                </div>
                <div className="candidate-title-group">
                  <div className="candidate-name-main">{c.candidateName}</div>
                  {c.tamilName && <div className="candidate-name-tamil">{c.tamilName}</div>}
                  <div className="party-badge-row">
                    <span
                      className="party-tag"
                      style={{ background: c.partyColor || '#4f46e5' }}
                    >
                      {c.party}
                    </span>
                    {c.alliance && <span className="alliance-tag">{c.alliance}</span>}
                  </div>
                </div>
              </div>

              {c.role && <div className="candidate-role-text">{c.role}</div>}

              <div className="candidate-info-specs">
                <div className="spec-item">
                  <span className="spec-label">Constituency</span>
                  <span className="spec-val">{c.constituency || 'Tamil Nadu'}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Symbol</span>
                  <span className="spec-val">{c.symbol || 'Ballot'}</span>
                </div>
                {c.age && (
                  <div className="spec-item">
                    <span className="spec-label">Age</span>
                    <span className="spec-val">{c.age} Years</span>
                  </div>
                )}
                {c.education && (
                  <div className="spec-item">
                    <span className="spec-label">Education</span>
                    <span className="spec-val" title={c.education}>
                      {c.education.split('(')[0]}
                    </span>
                  </div>
                )}
                {c.experience && (
                  <div className="spec-item" style={{ gridColumn: 'span 2' }}>
                    <span className="spec-label">Experience</span>
                    <span className="spec-val">{c.experience}</span>
                  </div>
                )}
              </div>

              {c.manifesto && (
                <div className="manifesto-box">
                  <div className="manifesto-title">Key Manifesto / Agenda</div>
                  <ul className="manifesto-list">
                    {c.keyPoints ? (
                      c.keyPoints.map((pt, idx) => <li key={idx}>{pt}</li>)
                    ) : (
                      <li>{c.manifesto}</li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {!user?.voted && (
              <div className="card-select-footer">
                <Link to="/vote" className="card-select-btn" style={{ textDecoration: 'none' }}>
                  🗳️ Vote for Candidate
                </Link>
              </div>
            )}
          </div>
        ))}

        {filteredCandidates.length === 0 && (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '30px' }}>
            <p>No candidates match your search "{searchQuery}".</p>
          </div>
        )}
      </div>
    </div>
  )
}
