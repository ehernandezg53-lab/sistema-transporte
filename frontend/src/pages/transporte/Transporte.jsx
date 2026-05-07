import { useState, useEffect } from 'react'
import api from '../../api/axios'
import './Transporte.css'

const Transporte = () => {
  const [vehiculos, setVehiculos] = useState([])
  const [conductores, setConductores] = useState([])
  const [rutas, setRutas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [vistaActual, setVistaActual] = useState('vehiculos')
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState(null)

  const [formVehiculo, setFormVehiculo] = useState({ placa: '', estado: 'activo' })
  const [formConductor, setFormConductor] = useState({ nombre: '', telefono: '', estado: 'activo' })
  const [formRuta, setFormRuta] = useState({
    destino: '', fecha_salida: '', fecha_entrega: '', estado: 'pendiente', vehiculo_id: '', conductor_id: ''
  })

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      const [vehiculosRes, conductoresRes, rutasRes] = await Promise.all([
        api.get('/transporte/vehiculos/'),
        api.get('/transporte/conductores/'),
        api.get('/transporte/rutas/'),
      ])
      setVehiculos(vehiculosRes.data)
      setConductores(conductoresRes.data)
      setRutas(rutasRes.data)
    } catch (err) {
      setError('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitVehiculo = async () => {
    try {
      if (editando) {
        await api.put(`/transporte/vehiculos/${editando.id}/`, formVehiculo)
      } else {
        await api.post('/transporte/vehiculos/', formVehiculo)
      }
      setShowModal(false)
      setEditando(null)
      setFormVehiculo({ placa: '', estado: 'activo' })
      cargarDatos()
    } catch (err) {
      setError('Error al guardar el vehículo')
    }
  }

  const handleSubmitConductor = async () => {
    try {
      if (editando) {
        await api.put(`/transporte/conductores/${editando.id}/`, formConductor)
      } else {
        await api.post('/transporte/conductores/', formConductor)
      }
      setShowModal(false)
      setEditando(null)
      setFormConductor({ nombre: '', telefono: '', estado: 'activo' })
      cargarDatos()
    } catch (err) {
      setError('Error al guardar el conductor')
    }
  }

  const handleSubmitRuta = async () => {
    try {
      if (editando) {
        await api.put(`/transporte/rutas/${editando.id}/`, formRuta)
      } else {
        await api.post('/transporte/rutas/', formRuta)
      }
      setShowModal(false)
      setEditando(null)
      setFormRuta({ destino: '', fecha_salida: '', fecha_entrega: '', estado: 'pendiente', vehiculo_id: '', conductor_id: '' })
      cargarDatos()
    } catch (err) {
      setError('Error al guardar la ruta')
    }
  }

  const handleEditar = (item) => {
    setEditando(item)
    if (vistaActual === 'vehiculos') {
      setFormVehiculo({ placa: item.placa, estado: item.estado })
    } else if (vistaActual === 'conductores') {
      setFormConductor({ nombre: item.nombre, telefono: item.telefono || '', estado: item.estado })
    } else if (vistaActual === 'rutas') {
      setFormRuta({
        destino: item.destino,
        fecha_salida: item.fecha_salida,
        fecha_entrega: item.fecha_entrega,
        estado: item.estado,
        vehiculo_id: item.vehiculo_id || '',
        conductor_id: item.conductor_id || '',
      })
    }
    setShowModal(true)
  }

  const handleNuevo = () => {
    setEditando(null)
    if (vistaActual === 'vehiculos') setFormVehiculo({ placa: '', estado: 'activo' })
    else if (vistaActual === 'conductores') setFormConductor({ nombre: '', telefono: '', estado: 'activo' })
    else if (vistaActual === 'rutas') setFormRuta({ destino: '', fecha_salida: '', fecha_entrega: '', estado: 'pendiente', vehiculo_id: '', conductor_id: '' })
    setShowModal(true)
  }

  const handleSubmit = () => {
    if (vistaActual === 'vehiculos') handleSubmitVehiculo()
    else if (vistaActual === 'conductores') handleSubmitConductor()
    else if (vistaActual === 'rutas') handleSubmitRuta()
  }

  if (loading) return <p className="transporte-loading">Cargando...</p>

  return (
    <div className="transporte-container">
      <h2 className="transporte-title">Gestión de Transporte</h2>

      {error && <p className="transporte-error">{error}</p>}

      <div className="transporte-tabs">
        <button className={vistaActual === 'vehiculos' ? 'transporte-tab-activo' : 'transporte-tab'} onClick={() => setVistaActual('vehiculos')}>
          🚛 Vehículos
        </button>
        <button className={vistaActual === 'conductores' ? 'transporte-tab-activo' : 'transporte-tab'} onClick={() => setVistaActual('conductores')}>
          👤 Conductores
        </button>
        <button className={vistaActual === 'rutas' ? 'transporte-tab-activo' : 'transporte-tab'} onClick={() => setVistaActual('rutas')}>
          🗺️ Rutas
        </button>
      </div>

      {vistaActual === 'vehiculos' && (
        <>
          <div className="transporte-header">
            <h3 className="transporte-subtitle">Lista de Vehículos</h3>
            <button className="transporte-btn-nuevo" onClick={handleNuevo}>+ Nuevo Vehículo</button>
          </div>
          <table className="transporte-table">
            <thead>
              <tr>
                <th className="transporte-th">Placa</th>
                <th className="transporte-th">Estado</th>
                <th className="transporte-th">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {vehiculos.map((v) => (
                <tr key={v.id} className="transporte-tr">
                  <td className="transporte-td">{v.placa}</td>
                  <td className="transporte-td">
                    <span className={`estado-${v.estado.replace('_', '-')}`}>
                      {v.estado.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="transporte-td">
                    <button className="btn-editar" onClick={() => handleEditar(v)}>Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {vistaActual === 'conductores' && (
        <>
          <div className="transporte-header">
            <h3 className="transporte-subtitle">Lista de Conductores</h3>
            <button className="transporte-btn-nuevo" onClick={handleNuevo}>+ Nuevo Conductor</button>
          </div>
          <table className="transporte-table">
            <thead>
              <tr>
                <th className="transporte-th">Nombre</th>
                <th className="transporte-th">Teléfono</th>
                <th className="transporte-th">Estado</th>
                <th className="transporte-th">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {conductores.map((c) => (
                <tr key={c.id} className="transporte-tr">
                  <td className="transporte-td">{c.nombre}</td>
                  <td className="transporte-td">{c.telefono || '-'}</td>
                  <td className="transporte-td">
                    <span className={`estado-${c.estado}`}>{c.estado}</span>
                  </td>
                  <td className="transporte-td">
                    <button className="btn-editar" onClick={() => handleEditar(c)}>Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {vistaActual === 'rutas' && (
        <>
          <div className="transporte-header">
            <h3 className="transporte-subtitle">Lista de Rutas</h3>
            <button className="transporte-btn-nuevo" onClick={handleNuevo}>+ Nueva Ruta</button>
          </div>
          <table className="transporte-table">
            <thead>
              <tr>
                <th className="transporte-th">Destino</th>
                <th className="transporte-th">Vehículo</th>
                <th className="transporte-th">Conductor</th>
                <th className="transporte-th">Fecha Salida</th>
                <th className="transporte-th">Fecha Entrega</th>
                <th className="transporte-th">Estado</th>
                <th className="transporte-th">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rutas.map((r) => (
                <tr key={r.id} className="transporte-tr">
                  <td className="transporte-td">{r.destino}</td>
                  <td className="transporte-td">{r.vehiculo_placa || '-'}</td>
                  <td className="transporte-td">{r.conductor_nombre || '-'}</td>
                  <td className="transporte-td">{r.fecha_salida}</td>
                  <td className="transporte-td">{r.fecha_entrega}</td>
                  <td className="transporte-td">
                    <span className={`estado-${r.estado.replace('_', '-')}`}>
                      {r.estado.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="transporte-td">
                    <button className="btn-editar" onClick={() => handleEditar(r)}>Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {showModal && (
        <div className="overlay">
          <div className="modal">
            <h3 className="modal-title">
              {editando ? 'Editar' : 'Nuevo'} {vistaActual === 'vehiculos' ? 'Vehículo' : vistaActual === 'conductores' ? 'Conductor' : 'Ruta'}
            </h3>

            {vistaActual === 'vehiculos' && (
              <>
                <div className="field">
                  <label className="field-label">Placa</label>
                  <input className="field-input" value={formVehiculo.placa} onChange={(e) => setFormVehiculo({ ...formVehiculo, placa: e.target.value })} placeholder="Placa del vehículo" />
                </div>
                <div className="field">
                  <label className="field-label">Estado</label>
                  <select className="field-input" value={formVehiculo.estado} onChange={(e) => setFormVehiculo({ ...formVehiculo, estado: e.target.value })}>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="en_mantenimiento">En Mantenimiento</option>
                  </select>
                </div>
              </>
            )}

            {vistaActual === 'conductores' && (
              <>
                <div className="field">
                  <label className="field-label">Nombre</label>
                  <input className="field-input" value={formConductor.nombre} onChange={(e) => setFormConductor({ ...formConductor, nombre: e.target.value })} placeholder="Nombre del conductor" />
                </div>
                <div className="field">
                  <label className="field-label">Teléfono</label>
                  <input className="field-input" value={formConductor.telefono} onChange={(e) => setFormConductor({ ...formConductor, telefono: e.target.value })} placeholder="Teléfono" />
                </div>
                <div className="field">
                  <label className="field-label">Estado</label>
                  <select className="field-input" value={formConductor.estado} onChange={(e) => setFormConductor({ ...formConductor, estado: e.target.value })}>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </>
            )}

            {vistaActual === 'rutas' && (
              <>
                <div className="field">
                  <label className="field-label">Destino</label>
                  <input className="field-input" value={formRuta.destino} onChange={(e) => setFormRuta({ ...formRuta, destino: e.target.value })} placeholder="Destino" />
                </div>
                <div className="field">
                  <label className="field-label">Vehículo</label>
                  <select className="field-input" value={formRuta.vehiculo_id} onChange={(e) => setFormRuta({ ...formRuta, vehiculo_id: e.target.value })}>
                    <option value="">Selecciona un vehículo</option>
                    {vehiculos.filter(v => v.estado === 'activo').map((v) => (
                      <option key={v.id} value={v.id}>{v.placa}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label className="field-label">Conductor</label>
                  <select className="field-input" value={formRuta.conductor_id} onChange={(e) => setFormRuta({ ...formRuta, conductor_id: e.target.value })}>
                    <option value="">Selecciona un conductor</option>
                    {conductores.filter(c => c.estado === 'activo').map((c) => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label className="field-label">Fecha de Salida</label>
                  <input className="field-input" type="date" value={formRuta.fecha_salida} onChange={(e) => setFormRuta({ ...formRuta, fecha_salida: e.target.value })} />
                </div>
                <div className="field">
                  <label className="field-label">Fecha de Entrega</label>
                  <input className="field-input" type="date" value={formRuta.fecha_entrega} onChange={(e) => setFormRuta({ ...formRuta, fecha_entrega: e.target.value })} />
                </div>
                <div className="field">
                  <label className="field-label">Estado</label>
                  <select className="field-input" value={formRuta.estado} onChange={(e) => setFormRuta({ ...formRuta, estado: e.target.value })}>
                    <option value="pendiente">Pendiente</option>
                    <option value="en_proceso">En Proceso</option>
                    <option value="finalizada">Finalizada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
              </>
            )}

            <div className="modal-buttons">
              <button className="btn-cancelar" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn-guardar" onClick={handleSubmit}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Transporte