import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="page container narrow" style={{ textAlign: 'center' }}>
      <h1>404</h1>
      <p>Page not found.</p>
      <Link className="btn btn-primary" to="/">Go Home</Link>
    </div>
  )
}
