import { useState, useEffect } from 'react'
import api from '../api/axios'

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [usuarioEditando, setUsuarioEditando] = useState(null)
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    password: '',
    rol_id: '',
  })

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      const [usuariosRes, rolesRes] = await Promise.all([
        api.get('/users/'),
        api.get('/users/roles/'),
      ])
      setUsuarios(usuariosRes.data)
      setRoles(rolesRes.data)
    } catch (err) {
      setError('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      if (usuarioEditando) {
        await api.put(`/users/${usuarioEditando.id}/editar/`, {
          nombre: form.nombre,
          correo: form.correo,
          rol_id: form.rol_id,
        })
      } else {
        await api.post('/users/crear/', form)
      }
      setShowModal(false)
      setUsuarioEditando(null)
      setForm({ nombre: '', correo: '', password: '', rol_id: '' })
      cargarDatos()
    } catch (err) {
      setError('Error al guardar el usuario')
    }
  }

  const handleEditar = (usuario) => {
    setUsuarioEditando(usuario)
    setForm({
      nombre: usuario.nombre,
      correo: usuario.correo,
      password: '',
      rol_id: usuario.rol?.id || '',
    })
    setShowModal(true)
  }

  const handleToggleEstado = async (id) => {
    try {
      await api.patch(`/users/${id}/toggle/`)
      cargarDatos()
    } catch (err) {
      setError('Error al cambiar el estado')
    }
  }

  const handleNuevo = () => {
    setUsuarioEditando(null)
    setForm({ nombre: '', correo: '', password: '', rol_id: '' })
    setShowModal(true)
  }

  if (loading) return <p style={styles.loading}>Cargando...</p>

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Gestión de Usuarios</h2>
        <button style={styles.btnNuevo} onClick={handleNuevo}>
          + Nuevo Usuario
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Nombre</th>
            <th style={styles.th}>Correo</th>
            <th style={styles.th}>Rol</th>
            <th style={styles.th}>Estado</th>
            <th style={styles.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id} style={styles.tr}>
              <td style={styles.td}>{usuario.nombre}</td>
              <td style={styles.td}>{usuario.correo}</td>
              <td style={styles.td}>{usuario.rol?.nombre_rol || 'Sin rol'}</td>
              <td style={styles.td}>
                <span style={usuario.estado ? styles.activo : styles.inactivo}>
                  {usuario.estado ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td style={styles.td}>
                <button style={styles.btnEditar} onClick={() => handleEditar(usuario)}>
                  Editar
                </button>
                <button
                  style={usuario.estado ? styles.btnDesactivar : styles.btnActivar}
                  onClick={() => handleToggleEstado(usuario.id)}
                >
                  {usuario.estado ? 'Desactivar' : 'Activar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>
              {usuarioEditando ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h3>

            <div style={styles.field}>
              <label style={styles.label}>Nombre</label>
              <input
                style={styles.input}
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Nombre completo"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Correo</label>
              <input
                style={styles.input}
                type="email"
                value={form.correo}
                onChange={(e) => setForm({ ...form, correo: e.target.value })}
                placeholder="correo@ejemplo.com"
              />
            </div>

            {!usuarioEditando && (
              <div style={styles.field}>
                <label style={styles.label}>Contraseña</label>
                <input
                  style={styles.input}
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
            )}

            <div style={styles.field}>
              <label style={styles.label}>Rol</label>
              <select
                style={styles.input}
                value={form.rol_id}
                onChange={(e) => setForm({ ...form, rol_id: e.target.value })}
              >
                <option value="">Selecciona un rol</option>
                {roles.map((rol) => (
                  <option key={rol.id} value={rol.id}>
                    {rol.nombre_rol}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.modalButtons}>
              <button style={styles.btnCancelar} onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button style={styles.btnGuardar} onClick={handleSubmit}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { padding: '32px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { margin: 0, color: '#1a1a2e' },
  btnNuevo: { padding: '10px 20px', backgroundColor: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' },
  th: { padding: '14px 16px', backgroundColor: '#1a1a2e', color: '#fff', textAlign: 'left' },
  tr: { borderBottom: '1px solid #eee' },
  td: { padding: '12px 16px', color: '#333' },
  activo: { backgroundColor: '#d4edda', color: '#155724', padding: '4px 10px', borderRadius: '12px', fontSize: '12px' },
  inactivo: { backgroundColor: '#f8d7da', color: '#721c24', padding: '4px 10px', borderRadius: '12px', fontSize: '12px' },
  btnEditar: { marginRight: '8px', padding: '6px 12px', backgroundColor: '#f0ad4e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  btnDesactivar: { padding: '6px 12px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  btnActivar: { padding: '6px 12px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  loading: { textAlign: 'center', marginTop: '40px' },
  error: { backgroundColor: '#ffe0e0', color: '#cc0000', padding: '10px', borderRadius: '8px', marginBottom: '16px' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { backgroundColor: '#fff', padding: '32px', borderRadius: '12px', width: '100%', maxWidth: '450px' },
  modalTitle: { marginBottom: '20px', color: '#1a1a2e' },
  field: { marginBottom: '16px' },
  label: { display: 'block', marginBottom: '6px', color: '#333', fontWeight: '500' },
  input: { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
  modalButtons: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' },
  btnCancelar: { padding: '10px 20px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  btnGuardar: { padding: '10px 20px', backgroundColor: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
}

export default Usuarios