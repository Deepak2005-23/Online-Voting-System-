import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="page container">
      <div className="hero">
        <h1>Online Voting System</h1>
        <p>A secure platform to register, log in, and cast your vote in ongoing elections.</p>
        {!user && (
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/register">Get Started</Link>
            <Link className="btn btn-outline" to="/login">Login</Link>
          </div>
        )}
        {user && user.role === 'VOTER' && (
          <Link className="btn btn-primary" to="/vote">Go to Vote</Link>
        )}
        {user && user.role === 'ADMIN' && (
          <Link className="btn btn-primary" to="/admin">Go to Dashboard</Link>
        )}
      </div>
    </div>
  )
}
