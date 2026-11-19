import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'VOTER' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await registerUser(form)
      login(res.data)
      navigate(res.data.role === 'ADMIN' ? '/admin' : '/voter')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page container narrow">
      <div className="card">
        <h2>Create an Account</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input name="name" value={form.name} onChange={handleChange} required />

          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />

          <label>Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} />

          <label>Register as</label>
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="VOTER">Voter</option>
            <option value="ADMIN">Admin</option>
          </select>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  )
}
