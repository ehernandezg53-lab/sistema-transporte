import { useState, useEffect } from 'react'
import api from '../../api/axios'
import './Usuarios.css'

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

  if (loading) return <p className="usuarios-loading">Cargando...</p>

  return (
    <div className="usuarios-container">
      <div className="usuarios-header">
        <h2 className="usuarios-title">Gestión de Usuarios</h2>
        <button className="usuarios-btn-nuevo" onClick={handleNuevo}>
          + Nuevo Usuario
        </button>
      </div>

      {error && <p className="usuarios-error">{error}</p>}

      <table className="usuarios-table">
        <thead>
          <tr>
            <th className="usuarios-th">Nombre</th>
            <th className="usuarios-th">Correo</th>
            <th className="usuarios-th">Rol</th>
            <th className="usuarios-th">Estado</th>
            <th className="usuarios-th">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id} className="usuarios-tr">
              <td className="usuarios-td">{usuario.nombre}</td>
              <td className="usuarios-td">{usuario.correo}</td>
              <td className="usuarios-td">{usuario.rol?.nombre_rol || 'Sin rol'}</td>
              <td className="usuarios-td">
                <span className={usuario.estado ? 'estado-activo' : 'estado-inactivo'}>
                  {usuario.estado ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="usuarios-td">
                <button className="btn-editar" onClick={() => handleEditar(usuario)}>
                  Editar
                </button>
                <button
                  className={usuario.estado ? 'btn-desactivar' : 'btn-activar'}
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
        <div className="overlay">
          <div className="modal">
            <h3 className="modal-title">
              {usuarioEditando ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h3>

            <div className="field">
              <label className="field-label">Nombre</label>
              <input
                className="field-input"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Nombre completo"
              />
            </div>

            <div className="field">
              <label className="field-label">Correo</label>
              <input
                className="field-input"
                type="email"
                value={form.correo}
                onChange={(e) => setForm({ ...form, correo: e.target.value })}
                placeholder="correo@ejemplo.com"
              />
            </div>

            {!usuarioEditando && (
              <div className="field">
                <label className="field-label">Contraseña</label>
                <input
                  className="field-input"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
            )}

            <div className="field">
              <label className="field-label">Rol</label>
              <select
                className="field-input"
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

            <div className="modal-buttons">
              <button className="btn-cancelar" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button className="btn-guardar" onClick={handleSubmit}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Usuarios