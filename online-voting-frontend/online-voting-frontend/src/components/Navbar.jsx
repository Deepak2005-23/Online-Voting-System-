import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">🗳️ Online Voting System</Link>
      <div className="navbar-links">
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        {user && user.role === 'ADMIN' && (
          <>
            <Link to="/admin">Dashboard</Link>
            <Link to="/results">Results</Link>
          </>
        )}
        {user && user.role === 'VOTER' && (
          <>
            <Link to="/voter">Dashboard</Link>
            <Link to="/vote">Vote</Link>
          </>
        )}
        {user && (
          <>
            <span className="navbar-user">Hi, {user.name}</span>
            <button className="btn-link" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  )
}
