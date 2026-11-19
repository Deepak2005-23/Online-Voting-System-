import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getResults } from '../services/api.js'

export default function ResultPage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getResults()
      .then((res) => setData(res.data))
      .catch(() => setError('Failed to load results'))
  }, [])

  if (error)
    return (
      <div className="page container">
        <div className="alert alert-error">{error}</div>
      </div>
    )

  if (!data) return <div className="page container">Loading results...</div>

  const sorted = [...(data.results || [])].sort((a, b) => b.voteCount - a.voteCount)
  const leadingCandidate = sorted[0]

  return (
    <div className="page container">
      <div className="election-banner">
        <h2>📊 Tamil Nadu Legislative Assembly — Live Election Results</h2>
        <p>Real-time tally of recorded electronic ballots across all constituencies.</p>
        <div className="election-meta-bar">
          <div className="election-meta-item">
            🗳️ <strong>Total Votes Cast:</strong> {data.totalVotes?.toLocaleString()}
          </div>
          <div className="election-meta-item">
            🏛️ <strong>Total Contesting Candidates:</strong> {sorted.length}
          </div>
          {leadingCandidate && leadingCandidate.voteCount > 0 && (
            <div className="election-meta-item" style={{ background: 'rgba(255,255,255,0.25)' }}>
              🏆 <strong>Current Lead:</strong> {leadingCandidate.candidateName} ({leadingCandidate.party})
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0 }}>Candidate Vote Share</h3>
        <Link to="/voter" className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
          Back to Dashboard
        </Link>
      </div>

      <div className="results-list">
        {sorted.map((r, index) => {
          const isLeader = index === 0 && r.voteCount > 0

          return (
            <div
              className="card result-row"
              key={r.candidateId}
              style={{
                borderLeft: `5px solid ${r.partyColor || '#4f46e5'}`,
                padding: '16px 20px',
              }}
            >
              <div className="result-header" style={{ alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.6rem' }}>{r.symbolIcon || '🗳️'}</span>
                  <div>
                    <span style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                      {r.candidateName}{' '}
                      <span
                        className="party-tag"
                        style={{ background: r.partyColor || '#4f46e5', marginLeft: '6px' }}
                      >
                        {r.party}
                      </span>
                    </span>
                    {r.tamilName && (
                      <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                        {r.tamilName} • {r.constituency || 'Tamil Nadu'}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                    {r.voteCount?.toLocaleString()} votes
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    {r.percentage}% {isLeader && '👑 Leading'}
                  </div>
                </div>
              </div>

              <div className="progress-bar" style={{ height: '12px', marginTop: '10px' }}>
                <div
                  className="progress-fill"
                  style={{
                    width: `${r.percentage}%`,
                    background: r.partyColor || 'var(--primary)',
                  }}
                ></div>
              </div>
            </div>
          )
        })}

        {sorted.length === 0 && <p>No results available yet.</p>}
      </div>
    </div>
  )
}
