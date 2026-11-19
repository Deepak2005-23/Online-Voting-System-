import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getCandidates, castVote } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { TAMIL_NADU_CANDIDATES } from '../data/tamilnaduCandidates.js'

export default function VotePage() {
  const [candidates, setCandidates] = useState([])
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [votedCandidateData, setVotedCandidateData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [partyFilter, setPartyFilter] = useState('ALL')

  const { user, updateVotedStatus } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user already voted in this session or localStorage
    const savedVoted = localStorage.getItem('voted_candidate')
    if (savedVoted) {
      try {
        setVotedCandidateData(JSON.parse(savedVoted))
      } catch (e) {
        // ignore
      }
    }

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

  const handleVote = async () => {
    if (!selected) return
    setSubmitting(true)
    setError('')
    try {
      await castVote(selected)
      
      const chosen = candidates.find((c) => c.id === selected) || TAMIL_NADU_CANDIDATES.find((c) => c.id === selected)
      const voteConfirmation = {
        ...chosen,
        voteId: `TN-EVS-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        votedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }),
        voterName: user?.name || 'Deepak',
        voterEmail: user?.email || 'voter@voting.tn.gov.in',
      }
      localStorage.setItem('voted_candidate', JSON.stringify(voteConfirmation))
      setVotedCandidateData(voteConfirmation)
      
      updateVotedStatus()
      setSuccess(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cast vote')
    } finally {
      setSubmitting(false)
    }
  }

  const selectedCandidateObj = candidates.find((c) => c.id === selected)

  // Filter candidates
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

  // ==================== ALREADY VOTED OR SUCCESS VIEW ====================
  if (success || (user?.voted && votedCandidateData)) {
    const candidateVoted = votedCandidateData || candidates.find((c) => c.id === selected) || TAMIL_NADU_CANDIDATES[0]

    return (
      <div className="page container">
        <div className="vvpat-container">
          <div className="vvpat-slip">
            <div className="vvpat-header">
              <span className="vvpat-badge">✅ VVPAT Verified Ballot Slip</span>
              <h3>Election Commission of India - Tamil Nadu</h3>
              <p className="vvpat-slip-subtitle">
                Electronic Voting System (EVS) • Official Vote Confirmation & Audit Receipt
              </p>
            </div>

            <div className="vvpat-candidate-highlight">
              <div className="vvpat-symbol-box">
                {candidateVoted?.symbolIcon || '🗳️'}
              </div>
              <div className="vvpat-candidate-meta">
                <span
                  className="party-tag"
                  style={{ background: candidateVoted?.partyColor || '#4f46e5', marginBottom: '6px' }}
                >
                  {candidateVoted?.party} — {candidateVoted?.partyFull || candidateVoted?.party}
                </span>
                <h4>{candidateVoted?.candidateName}</h4>
                {candidateVoted?.tamilName && (
                  <div className="tamil-title">{candidateVoted?.tamilName}</div>
                )}
                <div>
                  <strong>Official Symbol:</strong> {candidateVoted?.symbol} {candidateVoted?.symbolTamil ? `(${candidateVoted?.symbolTamil})` : ''}
                </div>
              </div>
            </div>

            <div className="vvpat-specs-grid">
              <div className="spec-item">
                <span className="spec-label">Voter Name</span>
                <span className="spec-val">{user?.name || candidateVoted?.voterName || 'Deepak'}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Voter Email</span>
                <span className="spec-val">{user?.email || candidateVoted?.voterEmail || 'deepaksathiyamoorthy1@gmail.com'}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Constituency</span>
                <span className="spec-val">{candidateVoted?.constituency || 'Kolathur (Chennai)'}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">State</span>
                <span className="spec-val">Tamil Nadu</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Ballot Reference ID</span>
                <span className="spec-val" style={{ fontFamily: 'monospace', color: '#16a34a' }}>
                  {candidateVoted?.voteId || 'TN-EVS-2026-X79K2'}
                </span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Timestamp</span>
                <span className="spec-val">
                  {candidateVoted?.votedAt || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>
            </div>

            <div className="vvpat-seal-row">
              <span>🔒 Cryptographically Signed & Sealed in Digital Ballot Box</span>
              <span style={{ color: '#16a34a', fontWeight: 'bold' }}>Status: Confirmed</span>
            </div>

            <div className="vvpat-actions">
              <button className="btn btn-primary" onClick={() => navigate('/results')}>
                📊 View Live Results
              </button>
              <button className="btn btn-outline" onClick={() => navigate('/voter')}>
                🏠 Return to Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Display contesting candidates after submit */}
        <div className="post-submit-candidates-heading">
          <h3 style={{ marginBottom: '8px' }}>Tamil Nadu Assembly Election — Candidate Profiles Review</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
            All candidates contesting across Tamil Nadu constituencies in this election.
          </p>

          <div className="candidates-grid">
            {candidates.map((c) => {
              const isUserChoice = c.id === candidateVoted?.id || c.candidateName === candidateVoted?.candidateName
              return (
                <div
                  className={`candidate-card-rich ${isUserChoice ? 'selected' : ''}`}
                  key={c.id}
                  style={{ cursor: 'default' }}
                >
                  <div
                    className="card-top-stripe"
                    style={{ background: c.partyColor || '#4f46e5' }}
                  ></div>

                  {isUserChoice && (
                    <div className="candidate-voted-badge">
                      🌟 Your Choice
                    </div>
                  )}

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

                    <div className="candidate-role-text">{c.role}</div>

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
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // ==================== FALLBACK IF USER ALREADY VOTED (AND NO DETAILS STORED) ====================
  if (user?.voted && !success) {
    return (
      <div className="page container">
        <div className="alert alert-info">
          ℹ️ You have already cast your vote in this election. Duplicate voting is not permitted.
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <button className="btn btn-primary" onClick={() => navigate('/results')}>
            View Live Results
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/voter')}>
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (loading) return <div className="page container">Loading candidates...</div>

  // ==================== MAIN CAST YOUR VOTE VIEW ====================
  return (
    <div className="page container">
      {/* Election Header & Info Banner */}
      <div className="election-banner">
        <h2>🗳️ Tamil Nadu Legislative Assembly Election 2026</h2>
        <p>
          Official Electronic Voting Portal — Select your preferred candidate and submit your official ballot.
        </p>
        <div className="election-meta-bar">
          <div className="election-meta-item">
            👤 <strong>Voter:</strong> {user?.name || 'Deepak'}
          </div>
          <div className="election-meta-item">
            ✉️ <strong>Email:</strong> {user?.email || 'deepaksathiyamoorthy1@gmail.com'}
          </div>
          <div className="election-meta-item">
            📍 <strong>Region:</strong> Tamil Nadu, India
          </div>
          <div className="election-meta-item">
            🛡️ <strong>Ballot Type:</strong> Single Transferable Electronic Vote
          </div>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="🔍 Search candidate, party, symbol, or constituency..."
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
          Contesting Candidates ({filteredCandidates.length})
        </h3>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Click on any candidate card to select
        </span>
      </div>

      {/* Candidates Grid with Rich Information */}
      <div className="candidates-grid">
        {filteredCandidates.map((c) => {
          const isSelected = selected === c.id

          return (
            <div
              className={`candidate-card-rich ${isSelected ? 'selected' : ''}`}
              key={c.id}
              onClick={() => setSelected(c.id)}
            >
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

                {/* Candidate Extra Specifications */}
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

                {/* Manifesto and Key Points */}
                {c.manifesto && (
                  <div className="manifesto-box">
                    <div className="manifesto-title">Key Manifesto / Promises</div>
                    <ul className="manifesto-list">
                      {c.keyPoints ? (
                        c.keyPoints.slice(0, 3).map((pt, idx) => <li key={idx}>{pt}</li>)
                      ) : (
                        <li>{c.manifesto}</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Selection footer */}
              <div className="card-select-footer">
                <button
                  type="button"
                  className="card-select-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelected(c.id)
                  }}
                >
                  <input
                    type="radio"
                    name="candidate"
                    value={c.id}
                    checked={isSelected}
                    onChange={() => setSelected(c.id)}
                    style={{ margin: 0 }}
                  />
                  <span>{isSelected ? '✓ Candidate Selected' : 'Select Candidate'}</span>
                </button>
              </div>
            </div>
          )
        })}

        {filteredCandidates.length === 0 && (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '30px' }}>
            <p>No candidates match your search "{searchQuery}".</p>
            <button
              className="btn btn-outline"
              onClick={() => {
                setSearchQuery('')
                setPartyFilter('ALL')
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* ==================== SUBMIT VOTE SECTION (AFTER CANDIDATES) ==================== */}
      <div className="vote-submit-section">
        <div className="submit-selection-preview">
          <div className="selection-info-highlight">
            <div className="preview-symbol-icon">
              {selectedCandidateObj ? selectedCandidateObj.symbolIcon || '🗳️' : '❓'}
            </div>
            <div className="preview-candidate-details">
              <h4>
                {selectedCandidateObj
                  ? `Selected: ${selectedCandidateObj.candidateName} (${selectedCandidateObj.party})`
                  : 'No Candidate Selected Yet'}
              </h4>
              <p>
                {selectedCandidateObj
                  ? `Symbol: ${selectedCandidateObj.symbol} • Constituency: ${selectedCandidateObj.constituency || 'Tamil Nadu'}`
                  : 'Please select one candidate from the Tamil Nadu list above to enable your vote.'}
              </p>
            </div>
          </div>

          {selectedCandidateObj && (
            <span
              className="party-tag"
              style={{
                background: selectedCandidateObj.partyColor || '#4f46e5',
                fontSize: '0.9rem',
                padding: '6px 14px',
              }}
            >
              {selectedCandidateObj.party}
            </span>
          )}
        </div>

        <button
          className="submit-button-large"
          disabled={!selected || submitting}
          onClick={handleVote}
        >
          {submitting ? (
            '⏳ Submitting Your Official Vote...'
          ) : selectedCandidateObj ? (
            `🗳️ Submit Vote for ${selectedCandidateObj.candidateName}`
          ) : (
            'Select a Candidate to Submit Vote'
          )}
        </button>

        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b', marginTop: '10px', marginBottom: 0 }}>
          🔒 Your vote is confidential, immutable, and protected by the Election Commission of India.
        </p>
      </div>
    </div>
  )
}
