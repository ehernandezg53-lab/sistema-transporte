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
        <div style={styles.bienvenida}>
          <h2>Bienvenido, {user?.nombre} 👋</h2>
          <p>Selecciona un módulo del menú lateral para comenzar.</p>
          <div style={styles.tarjetas}>
            {menuAdmin.map((item) => (
              <div
                key={item.id}
                style={styles.tarjeta}
                onClick={() => setModuloActual(item.id)}
              >
                <h3>{item.label}</h3>
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
      <div style={styles.bienvenida}>
        <h3>Bienvenido, {user?.nombre}</h3>
        <p>Tu rol es: <strong>{user?.rol?.nombre_rol}</strong></p>
        <p>Los módulos de tu rol estarán disponibles próximamente.</p>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h2 style={styles.navTitle}>Sistema de Transporte</h2>
        <div style={styles.navRight}>
          <span style={styles.welcome}>Bienvenido, {user?.nombre}</span>
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
                style={moduloActual === item.id ? styles.sidebarItemActivo : styles.sidebarItem}
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
  container: { minHeight: '100vh', backgroundColor: '#f0f2f5', display: 'flex', flexDirection: 'column' },
  navbar: { backgroundColor: '#1a1a2e', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  navTitle: { color: '#fff', margin: 0 },
  navRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  welcome: { color: '#fff' },
  rol: { backgroundColor: '#ffffff30', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '12px' },
  logoutBtn: { padding: '8px 16px', backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  body: { display: 'flex', flex: 1 },
  sidebar: { width: '220px', backgroundColor: '#fff', padding: '24px 12px', boxShadow: '2px 0 8px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '8px' },
  sidebarTitle: { color: '#999', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', marginBottom: '8px', paddingLeft: '12px' },
  sidebarItem: { padding: '10px 12px', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontSize: '14px', color: '#333' },
  sidebarItemActivo: { padding: '10px 12px', backgroundColor: '#1a1a2e', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontSize: '14px', color: '#fff' },
  content: { flex: 1, padding: '32px', overflowY: 'auto' },
  bienvenida: { backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' },
  tarjetas: { display: 'flex', gap: '16px', marginTop: '24px', flexWrap: 'wrap' },
  tarjeta: { backgroundColor: '#f0f2f5', padding: '24px', borderRadius: '12px', cursor: 'pointer', minWidth: '180px', textAlign: 'center', border: '2px solid transparent' },
}

export default Dashboard