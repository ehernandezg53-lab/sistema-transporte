import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const Login = () => {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await api.post('/users/login/', { correo, password })
      login(response.data.user, response.data.access, response.data.refresh)
      navigate('/dashboard')
    } catch (err) {
      setError('Correo o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div className="spotify-card" style={styles.card}>
        <h2 style={styles.title}>Sistema de Transporte</h2>
        <p style={styles.subtitle}>Inicia sesión para continuar</p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Correo electrónico</label>
            <input
              className="spotify-input"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Contraseña</label>
            <input
              className="spotify-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button className="spotify-btn" type="submit" disabled={loading} style={{ width: '100%', marginTop: '8px' }}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--bg)',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '8px',
    color: 'var(--text-h)',
    fontSize: '28px',
    fontWeight: '700',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    textAlign: 'center',
    color: 'var(--text)',
    marginBottom: '24px',
    fontSize: '14px',
  },
  field: {
    marginBottom: '20px',
    textAlign: 'left',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: 'var(--text-h)',
    fontWeight: '600',
    fontSize: '14px',
  },
  error: {
    backgroundColor: 'rgba(255, 51, 75, 0.1)',
    color: 'var(--accent)',
    border: '1px solid rgba(255, 51, 75, 0.2)',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center',
    fontSize: '14px',
  },
}

export default Login