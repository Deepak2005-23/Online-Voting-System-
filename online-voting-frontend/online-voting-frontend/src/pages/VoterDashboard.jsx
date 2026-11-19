import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function VoterDashboard() {
  const { user } = useAuth()
  const [votedCandidate, setVotedCandidate] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('voted_candidate')
    if (saved) {
      try {
        setVotedCandidate(JSON.parse(saved))
      } catch (e) {
        // ignore
      }
    }
  }, [])

  return (
    <div className="page container">
      <div className="election-banner" style={{ marginBottom: '20px' }}>
        <h2>🗳️ Tamil Nadu Legislative Assembly Election 2026</h2>
        <p>Welcome to your personal voter portal and ballot dashboard.</p>
      </div>

      <div className="card">
        <h3>Voter Profile</h3>
        <p><strong>Name:</strong> {user?.name || 'Deepak'}</p>
        <p><strong>Email:</strong> {user?.email || 'deepaksathiyamoorthy1@gmail.com'}</p>
        <p>
          <strong>Voting status: </strong>
          {user?.voted ? (
            <span style={{ color: '#16a34a', fontWeight: 'bold' }}>
              ✅ You have already cast your official vote
            </span>
          ) : (
            <span style={{ color: '#ea580c', fontWeight: 'bold' }}>
              🕒 You have not voted yet
            </span>
          )}
        </p>

        {user?.voted && votedCandidate && (
          <div
            style={{
              background: '#f0fdf4',
              border: '2px solid #bbf7d0',
              borderRadius: '8px',
              padding: '16px',
              margin: '16px 0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ fontSize: '2.5rem' }}>{votedCandidate.symbolIcon || '🗳️'}</div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: 'bold' }}>
                  OFFICIAL RECORDED BALLOT
                </div>
                <h4 style={{ margin: '2px 0', color: '#14532d' }}>
                  {votedCandidate.candidateName}{' '}
                  <span style={{ fontSize: '0.9rem', color: '#166534' }}>({votedCandidate.party})</span>
                </h4>
                <div style={{ fontSize: '0.85rem', color: '#4b5563' }}>
                  Symbol: <strong>{votedCandidate.symbol}</strong> • Constituency: <strong>{votedCandidate.constituency}</strong>
                </div>
                {votedCandidate.voteId && (
                  <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '4px', fontFamily: 'monospace' }}>
                    Receipt Ref: {votedCandidate.voteId} • {votedCandidate.votedAt}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {!user?.voted ? (
            <Link className="btn btn-primary" to="/vote">
              🗳️ Cast Your Vote Now
            </Link>
          ) : (
            <Link className="btn btn-outline" to="/vote">
              📄 View Vote Confirmation Slip
            </Link>
          )}

          <Link className="btn btn-outline" to="/candidates">
            🏛️ View Tamil Nadu Candidates
          </Link>

          <Link className="btn btn-primary" to="/results" style={{ background: '#312e81' }}>
            📊 Live Election Results
          </Link>
        </div>
      </div>
    </div>
  )
}
