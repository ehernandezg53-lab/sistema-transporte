import { useState, useEffect } from 'react'
import api from '../../api/axios'
import './Taller.css'

const estadoClass = {
  pendiente: 'estado-pendiente',
  en_proceso: 'estado-en-proceso',
  finalizada: 'estado-finalizada',
  cancelada: 'estado-cancelada',
}

const Taller = () => {
  const [ordenes, setOrdenes] = useState([])
  const [mantenimientos, setMantenimientos] = useState([])
  const [vehiculos, setVehiculos] = useState([])
  const [mecanicos, setMecanicos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [vistaActual, setVistaActual] = useState('ordenes')
  
  const [showModalOrden, setShowModalOrden] = useState(false)
  const [showModalMantenimiento, setShowModalMantenimiento] = useState(false)
  const [showModalMecanico, setShowModalMecanico] = useState(false)
  const [ordenEditando, setOrdenEditando] = useState(null)
  const [mecanicoEditando, setMecanicoEditando] = useState(null)

  // Forms
  const [formOrden, setFormOrden] = useState({
    descripcion: '', area: 'mecanica_general', vehiculo_id: '', mecanico_id: '', estado: 'pendiente'
  })
  const [formMantenimiento, setFormMantenimiento] = useState({
    orden: '', tipo_mantenimiento: 'preventivo', fecha: '', lugar: ''
  })
  const [formMecanico, setFormMecanico] = useState({
    nombre: '', telefono: '', especialidad: '', estado: 'activo'
  })

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      const [ordenesRes, mantenimientosRes, vehiculosRes, mecanicosRes] = await Promise.all([
        api.get('/taller/ordenes/'),
        api.get('/taller/mantenimientos/'),
        api.get('/transporte/vehiculos/'),
        api.get('/taller/mecanicos/'),
      ])
      setOrdenes(ordenesRes.data)
      setMantenimientos(mantenimientosRes.data)
      setVehiculos(vehiculosRes.data)
      setMecanicos(mecanicosRes.data)
    } catch (err) {
      setError('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitOrden = async () => {
    try {
      if (ordenEditando) {
        await api.put(`/taller/ordenes/${ordenEditando.id}/`, formOrden)
      } else {
        await api.post('/taller/ordenes/', formOrden)
      }
      setShowModalOrden(false)
      setOrdenEditando(null)
      setFormOrden({ descripcion: '', area: 'mecanica_general', vehiculo_id: '', mecanico_id: '', estado: 'pendiente' })
      cargarDatos()
    } catch (err) {
      setError('Error al guardar la orden')
    }
  }

  const handleSubmitMantenimiento = async () => {
    try {
      await api.post('/taller/mantenimientos/', formMantenimiento)
      setShowModalMantenimiento(false)
      setFormMantenimiento({ orden: '', tipo_mantenimiento: 'preventivo', fecha: '', lugar: '' })
      cargarDatos()
    } catch (err) {
      setError('Error al guardar el mantenimiento')
    }
  }

  const handleSubmitMecanico = async () => {
    try {
      if (mecanicoEditando) {
        await api.put(`/taller/mecanicos/${mecanicoEditando.id}/`, formMecanico)
      } else {
        await api.post('/taller/mecanicos/', formMecanico)
      }
      setShowModalMecanico(false)
      setMecanicoEditando(null)
      setFormMecanico({ nombre: '', telefono: '', especialidad: '', estado: 'activo' })
      cargarDatos()
    } catch (err) {
      setError('Error al guardar el mecánico')
    }
  }

  const handleEditarOrden = (orden) => {
    setOrdenEditando(orden)
    setFormOrden({
      descripcion: orden.descripcion || '',
      area: orden.area,
      estado: orden.estado,
      vehiculo_id: orden.vehiculo_id ?? '',
      mecanico_id: orden.mecanico_id ?? '',
    })
    setShowModalOrden(true)
  }

  const handleEditarMecanico = (mecanico) => {
    setMecanicoEditando(mecanico)
    setFormMecanico({
      nombre: mecanico.nombre,
      telefono: mecanico.telefono || '',
      especialidad: mecanico.especialidad || '',
      estado: mecanico.estado,
    })
    setShowModalMecanico(true)
  }

  const handleNuevaOrden = () => {
    setOrdenEditando(null)
    setFormOrden({ descripcion: '', area: 'mecanica_general', vehiculo_id: '', mecanico_id: '', estado: 'pendiente' })
    setShowModalOrden(true)
  }

  if (loading) return <p className="taller-loading">Cargando...</p>

  return (
    <div className="taller-container">
      <h2 className="taller-title">Gestión de Taller</h2>

      {error && <p className="taller-error">{error}</p>}

      <div className="taller-tabs">
        <button className={vistaActual === 'ordenes' ? 'taller-tab-activo' : 'taller-tab'} onClick={() => setVistaActual('ordenes')}>
          📋 Órdenes de Trabajo
        </button>
        <button className={vistaActual === 'mantenimientos' ? 'taller-tab-activo' : 'taller-tab'} onClick={() => setVistaActual('mantenimientos')}>
          🔧 Mantenimientos
        </button>
        <button className={vistaActual === 'mecanicos' ? 'taller-tab-activo' : 'taller-tab'} onClick={() => setVistaActual('mecanicos')}>
          👨‍🔧 Mecánicos
        </button>
      </div>

      {vistaActual === 'ordenes' && (
        <>
          <div className="taller-header">
            <h3 className="taller-subtitle">Órdenes de Trabajo</h3>
            <button className="taller-btn-nuevo" onClick={handleNuevaOrden}>+ Nueva Orden</button>
          </div>
          <table className="taller-table">
            <thead>
              <tr>
                <th className="taller-th"># Orden</th>
                <th className="taller-th">Fecha</th>
                <th className="taller-th">Vehículo</th>
                <th className="taller-th">Mecánico</th>
                <th className="taller-th">Área</th>
                <th className="taller-th">Estado</th>
                <th className="taller-th">Descripción</th>
                <th className="taller-th">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((orden) => (
                <tr key={orden.id} className="taller-tr">
                  <td className="taller-td"><strong>{orden.numero_orden}</strong></td>
                  <td className="taller-td">{orden.fecha_creacion}</td>
                  <td className="taller-td">{orden.vehiculo_placa || '-'}</td>
                  <td className="taller-td">{orden.mecanico_nombre || '-'}</td>
                  <td className="taller-td">{orden.area?.replace('_', ' ')}</td>
                  <td className="taller-td">
                    <span className={estadoClass[orden.estado]}>
                      {orden.estado.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="taller-td">{orden.descripcion || '-'}</td>
                  <td className="taller-td">
                    <button className="btn-editar" onClick={() => handleEditarOrden(orden)}>Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {vistaActual === 'mantenimientos' && (
        <>
          <div className="taller-header">
            <h3 className="taller-subtitle">Mantenimientos</h3>
            <button className="taller-btn-nuevo" onClick={() => setShowModalMantenimiento(true)}>+ Nuevo Mantenimiento</button>
          </div>
          <table className="taller-table">
            <thead>
              <tr>
                <th className="taller-th">Orden</th>
                <th className="taller-th">Tipo</th>
                <th className="taller-th">Fecha</th>
                <th className="taller-th">Lugar</th>
              </tr>
            </thead>
            <tbody>
              {mantenimientos.map((m) => (
                <tr key={m.id} className="taller-tr">
                  <td className="taller-td">#{m.orden}</td>
                  <td className="taller-td">{m.tipo_mantenimiento}</td>
                  <td className="taller-td">{m.fecha}</td>
                  <td className="taller-td">{m.lugar}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {vistaActual === 'mecanicos' && (
        <>
          <div className="taller-header">
            <h3 className="taller-subtitle">Mecánicos</h3>
            <button className="taller-btn-nuevo" onClick={() => { setMecanicoEditando(null); setFormMecanico({ nombre: '', telefono: '', especialidad: '', estado: 'activo' }); setShowModalMecanico(true) }}>
              + Nuevo Mecánico
            </button>
          </div>
          <table className="taller-table">
            <thead>
              <tr>
                <th className="taller-th">Nombre</th>
                <th className="taller-th">Teléfono</th>
                <th className="taller-th">Especialidad</th>
                <th className="taller-th">Estado</th>
                <th className="taller-th">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {mecanicos.map((m) => (
                <tr key={m.id} className="taller-tr">
                  <td className="taller-td">{m.nombre}</td>
                  <td className="taller-td">{m.telefono || '-'}</td>
                  <td className="taller-td">{m.especialidad || '-'}</td>
                  <td className="taller-td">
                    <span className={m.estado === 'activo' ? 'estado-finalizada' : 'estado-cancelada'}>
                      {m.estado}
                    </span>
                  </td>
                  <td className="taller-td">
                    <button className="btn-editar" onClick={() => handleEditarMecanico(m)}>Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Modals */}
      {showModalOrden && (
        <div className="overlay">
          <div className="modal">
            <h3 className="modal-title">{ordenEditando ? 'Editar Orden' : 'Nueva Orden de Trabajo'}</h3>
            <div className="field">
              <label className="field-label">Vehículo</label>
              <select className="field-input" value={formOrden.vehiculo_id} onChange={(e) => setFormOrden({ ...formOrden, vehiculo_id: e.target.value })}>
                <option value="">Selecciona un vehículo</option>
                {vehiculos.filter(v => v.estado === 'activo').map((v) => (
                  <option key={v.id} value={v.id}>{v.placa}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="field-label">Mecánico</label>
              <select className="field-input" value={formOrden.mecanico_id} onChange={(e) => setFormOrden({ ...formOrden, mecanico_id: e.target.value })}>
                <option value="">Selecciona un mecánico</option>
                {mecanicos.filter(m => m.estado === 'activo').map((m) => (
                  <option key={m.id} value={m.id}>{m.nombre}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="field-label">Área</label>
              <select className="field-input" value={formOrden.area} onChange={(e) => setFormOrden({ ...formOrden, area: e.target.value })}>
                <option value="electrico">Eléctrico</option>
                <option value="tapiceria">Tapicería</option>
                <option value="llantas">Llantas</option>
                <option value="soldadura">Soldadura</option>
                <option value="mecanica_general">Mecánica General</option>
              </select>
            </div>
            {ordenEditando && (
              <div className="field">
                <label className="field-label">Estado</label>
                <select className="field-input" value={formOrden.estado} onChange={(e) => setFormOrden({ ...formOrden, estado: e.target.value })}>
                  <option value="pendiente">Pendiente</option>
                  <option value="en_proceso">En Proceso</option>
                  <option value="finalizada">Finalizada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
            )}
            <div className="field">
              <label className="field-label">Descripción</label>
              <textarea className="field-input" value={formOrden.descripcion} onChange={(e) => setFormOrden({ ...formOrden, descripcion: e.target.value })} placeholder="Descripción de la orden" />
            </div>
            <div className="modal-buttons">
              <button className="btn-cancelar" onClick={() => setShowModalOrden(false)}>Cancelar</button>
              <button className="btn-guardar" onClick={handleSubmitOrden}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {showModalMantenimiento && (
        <div className="overlay">
          <div className="modal">
            <h3 className="modal-title">Nuevo Mantenimiento</h3>
            <div className="field">
              <label className="field-label">Orden de Trabajo</label>
              <select className="field-input" value={formMantenimiento.orden} onChange={(e) => setFormMantenimiento({ ...formMantenimiento, orden: e.target.value })}>
                <option value="">Selecciona una orden</option>
                {ordenes.map((o) => (
                  <option key={o.id} value={o.id}>{o.numero_orden} - {o.estado}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="field-label">Tipo de Mantenimiento</label>
              <select className="field-input" value={formMantenimiento.tipo_mantenimiento} onChange={(e) => setFormMantenimiento({ ...formMantenimiento, tipo_mantenimiento: e.target.value })}>
                <option value="preventivo">Preventivo</option>
                <option value="correctivo">Correctivo</option>
              </select>
            </div>
            <div className="field">
              <label className="field-label">Fecha</label>
              <input className="field-input" type="date" value={formMantenimiento.fecha} onChange={(e) => setFormMantenimiento({ ...formMantenimiento, fecha: e.target.value })} />
            </div>
            <div className="field">
              <label className="field-label">Lugar</label>
              <input className="field-input" value={formMantenimiento.lugar} onChange={(e) => setFormMantenimiento({ ...formMantenimiento, lugar: e.target.value })} placeholder="Lugar del mantenimiento" />
            </div>
            <div className="modal-buttons">
              <button className="btn-cancelar" onClick={() => setShowModalMantenimiento(false)}>Cancelar</button>
              <button className="btn-guardar" onClick={handleSubmitMantenimiento}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {showModalMecanico && (
        <div className="overlay">
          <div className="modal">
            <h3 className="modal-title">{mecanicoEditando ? 'Editar Mecánico' : 'Nuevo Mecánico'}</h3>
            <div className="field">
              <label className="field-label">Nombre</label>
              <input className="field-input" value={formMecanico.nombre} onChange={(e) => setFormMecanico({ ...formMecanico, nombre: e.target.value })} placeholder="Nombre del mecánico" />
            </div>
            <div className="field">
              <label className="field-label">Teléfono</label>
              <input className="field-input" value={formMecanico.telefono} onChange={(e) => setFormMecanico({ ...formMecanico, telefono: e.target.value })} placeholder="Teléfono" />
            </div>
            <div className="field">
              <label className="field-label">Especialidad</label>
              <input className="field-input" value={formMecanico.especialidad} onChange={(e) => setFormMecanico({ ...formMecanico, especialidad: e.target.value })} placeholder="Especialidad" />
            </div>
            <div className="field">
              <label className="field-label">Estado</label>
              <select className="field-input" value={formMecanico.estado} onChange={(e) => setFormMecanico({ ...formMecanico, estado: e.target.value })}>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
            <div className="modal-buttons">
              <button className="btn-cancelar" onClick={() => setShowModalMecanico(false)}>Cancelar</button>
              <button className="btn-guardar" onClick={handleSubmitMecanico}>Guardar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Taller