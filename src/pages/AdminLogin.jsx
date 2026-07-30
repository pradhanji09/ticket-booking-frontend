import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await API.post('/api/auth/admin/login', { email, password })
      if (res.data.success) {
        login(res.data.data.user, res.data.data.token)
        navigate('/admin/events')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Admin login failed')
    }
  }

  return (
    <div>
      <h2>Admin Login</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email: </label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password: </label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Login as Admin</button>
      </form>
      <p>
        User login? <Link to="/login">User Login</Link>
      </p>
    </div>
  )
}
