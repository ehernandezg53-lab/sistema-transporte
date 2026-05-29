import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Usuarios from './usuarios/Usuarios'
import Bodega from './bodega/Bodega'
import Taller from './taller/Taller'
import Transporte from './transporte/Transporte'
import Reportes from './reportes/Reportes'


const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [moduloActual, setModuloActual] = useState(null)

  const esAdmin = user?.rol?.nombre_rol === 'Administrador'
  const esBodega = user?.rol?.nombre_rol === 'Bodega'
  const esTaller = user?.rol?.nombre_rol === 'Taller'
  const esLogistica = user?.rol?.nombre_rol === 'Logística de Transporte'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuAdmin = [
    { id: 'usuarios', label: '👥 Gestión de Usuarios' },
    { id: 'bodega', label: '📦 Gestión de Bodega' },
    { id: 'taller', label: '🔧 Gestión de Taller' },
    { id: 'transporte', label: '🚛 Gestión de Transporte' },
    { id: 'reportes', label: '📊 Panel de Reportes' },
  ]

  const renderModulo = () => {
    if (esAdmin) {
      if (moduloActual === 'usuarios') return <Usuarios />
      if (moduloActual === 'bodega') return <Bodega />
      if (moduloActual === 'taller') return <Taller />
      if (moduloActual === 'transporte') return <Transporte />
      if (moduloActual === 'reportes') return <Reportes />

      return (
        <div className="spotify-card" style={styles.bienvenida}>
          <h2 style={{ color: 'var(--text-h)', margin: '0 0 12px 0', fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px' }}>Bienvenido, {user?.nombre} 👋</h2>
          <p style={{ color: 'var(--text)', fontSize: '15px', marginBottom: '32px' }}>Selecciona un módulo del menú lateral para comenzar a administrar el sistema.</p>
          <div style={styles.tarjetas}>
            {menuAdmin.map((item) => (
              <div
                key={item.id}
                style={styles.tarjeta}
                onClick={() => setModuloActual(item.id)}
              >
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: 'var(--text-h)' }}>{item.label}</h3>
              </div>
            ))}
          </div>
        </div>
      )
    }
    if (esBodega) return <Bodega />
    if (esTaller) return <Taller />
    if (esLogistica) return <Transporte />
    return (
      <div className="spotify-card" style={styles.bienvenida}>
        <h3 style={{ color: 'var(--text-h)', margin: '0 0 12px 0', fontSize: '24px', fontWeight: '700' }}>Bienvenido, {user?.nombre} 👋</h3>
        <p style={{ color: 'var(--text)', marginBottom: '8px' }}>Tu rol es: <strong style={{ color: 'var(--accent)' }}>{user?.rol?.nombre_rol}</strong></p>
        <p style={{ color: 'var(--text)', fontSize: '14px' }}>Los módulos asignados a tu rol se cargarán automáticamente.</p>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h2 style={styles.navTitle} onClick={() => setModuloActual(null)}>Sistema de Transporte</h2>
        <div style={styles.navRight}>
          <span style={styles.welcome}>Hola, <strong>{user?.nombre}</strong></span>
          <span style={styles.rol}>{user?.rol?.nombre_rol}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div style={styles.body}>
        {esAdmin && (
          <div style={styles.sidebar}>
            <p style={styles.sidebarTitle}>MÓDULOS</p>
            {menuAdmin.map((item) => (
              <button
                key={item.id}
                className={moduloActual === item.id ? 'spotify-sidebar-btn active' : 'spotify-sidebar-btn'}
                onClick={() => setModuloActual(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        <div style={styles.content}>
          {renderModulo()}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: 'var(--bg)', display: 'flex', flexDirection: 'column' },
  navbar: { backgroundColor: 'var(--sidebar-bg)', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' },
  navTitle: { color: 'var(--text-h)', margin: 0, fontWeight: '700', letterSpacing: '-0.8px', cursor: 'pointer' },
  navRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  welcome: { color: 'var(--text)', fontSize: '14px' },
  rol: { backgroundColor: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--accent-border)', padding: '4px 12px', borderRadius: '500px', fontSize: '12px', fontWeight: '600' },
  logoutBtn: { padding: '8px 16px', backgroundColor: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '500px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s' },
  body: { display: 'flex', flex: 1 },
  sidebar: { width: '240px', backgroundColor: 'var(--sidebar-bg)', padding: '24px 12px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '4px' },
  sidebarTitle: { color: '#52525b', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', marginBottom: '12px', paddingLeft: '16px' },
  content: { flex: 1, padding: '32px', overflowY: 'auto' },
  bienvenida: { padding: '40px', textAlign: 'left' },
  tarjetas: { display: 'flex', gap: '20px', marginTop: '16px', flexWrap: 'wrap' },
  tarjeta: { backgroundColor: 'var(--sidebar-bg)', border: '1px solid var(--border)', padding: '28px 24px', borderRadius: '12px', cursor: 'pointer', minWidth: '200px', textAlign: 'center', transition: 'all 0.2s ease', flex: '1 1 calc(33.333% - 20px)' },
}

export default Dashboard