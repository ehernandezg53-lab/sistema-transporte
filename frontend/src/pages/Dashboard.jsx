import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Usuarios from './Usuarios'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const esAdmin = user?.rol?.nombre_rol === 'Administrador'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h2 style={styles.navTitle}>Sistema de Transporte</h2>
        <div style={styles.navRight}>
          <span style={styles.welcome}>Bienvenido, {user?.nombre}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>
      <div style={styles.content}>
        {esAdmin ? (
          <Usuarios />
        ) : (
          <div style={styles.sinModulo}>
            <h3>Bienvenido, {user?.nombre}</h3>
            <p>Tu rol es: <strong>{user?.rol?.nombre_rol}</strong></p>
            <p>Los módulos de tu rol estarán disponibles próximamente.</p>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
  },
  navbar: {
    backgroundColor: '#1a1a2e',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navTitle: {
    color: '#fff',
    margin: 0,
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  welcome: {
    color: '#fff',
  },
  logoutBtn: {
    padding: '8px 16px',
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  content: {
    padding: '32px',
  },
  sinModulo: {
    backgroundColor: '#fff',
    padding: '32px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    textAlign: 'center',
  },
}

export default Dashboard