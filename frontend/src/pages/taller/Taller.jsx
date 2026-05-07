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
  const [repuestos, setRepuestos] = useState([])
  const [vehiculos, setVehiculos] = useState([])
  const [mecanicos, setMecanicos] = useState([])
  const [repuestosDisponibles, setRepuestosDisponibles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [vistaActual, setVistaActual] = useState('ordenes')
  const [showModalOrden, setShowModalOrden] = useState(false)
  const [showModalMantenimiento, setShowModalMantenimiento] = useState(false)
  const [showModalRepuesto, setShowModalRepuesto] = useState(false)
  const [ordenEditando, setOrdenEditando] = useState(null)

  const [formOrden, setFormOrden] = useState({
    estado: 'pendiente',
    descripcion: '',
    area: 'mecanica_general',
    vehiculo_id: '',
    mecanico_id: '',
  })
  const [formMantenimiento, setFormMantenimiento] = useState({
    orden: '', tipo_mantenimiento: 'preventivo', fecha: '', lugar: ''
  })
  const [formRepuesto, setFormRepuesto] = useState({
    mantenimiento: '', repuesto_id: '', cantidad: ''
  })

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      const [ordenesRes, mantenimientosRes, repuestosRes, repuestosDispRes, vehiculosRes, mecanicosRes] = await Promise.all([
        api.get('/taller/ordenes/'),
        api.get('/taller/mantenimientos/'),
        api.get('/taller/repuestos/'),
        api.get('/bodega/repuestos/'),
        api.get('/transporte/vehiculos/'),
        api.get('/transporte/conductores/'),
      ])
      setOrdenes(ordenesRes.data)
      setMantenimientos(mantenimientosRes.data)
      setRepuestos(repuestosRes.data)
      setRepuestosDisponibles(repuestosDispRes.data)
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
      setFormOrden({ estado: 'pendiente', descripcion: '', area: 'mecanica_general', vehiculo_id: '', mecanico_id: '' })
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

  const handleSubmitRepuesto = async () => {
    try {
      await api.post('/taller/repuestos/', formRepuesto)
      setShowModalRepuesto(false)
      setFormRepuesto({ mantenimiento: '', repuesto_id: '', cantidad: '' })
      cargarDatos()
    } catch (err) {
      setError('Error al registrar el repuesto. Verifique el stock.')
    }
  }

  const handleEditarOrden = (orden) => {
    setOrdenEditando(orden)
    setFormOrden({
      estado: orden.estado,
      descripcion: orden.descripcion || '',
      area: orden.area,
      vehiculo_id: orden.vehiculo_id || '',
      mecanico_id: orden.mecanico_id || '',
    })
    setShowModalOrden(true)
  }

  const handleNuevaOrden = () => {
    setOrdenEditando(null)
    setFormOrden({ estado: 'pendiente', descripcion: '', area: 'mecanica_general', vehiculo_id: '', mecanico_id: '' })
    setShowModalOrden(true)
  }

  if (loading) return <p className="taller-loading">Cargando...</p>

  return (
    <div className="taller-container">
      <h2 className="taller-title">Gestión de Taller</h2>

      {error && <p className="taller-error">{error}</p>}

      <div className="taller-tabs">
        <button className={vistaActual === 'ordenes' ? 'taller-tab-activo' : 'taller-tab'} onClick={() => setVistaActual('ordenes')}>
          Órdenes de Trabajo
        </button>
        <button className={vistaActual === 'mantenimientos' ? 'taller-tab-activo' : 'taller-tab'} onClick={() => setVistaActual('mantenimientos')}>
          Mantenimientos
        </button>
        <button className={vistaActual === 'repuestos' ? 'taller-tab-activo' : 'taller-tab'} onClick={() => setVistaActual('repuestos')}>
          Repuestos Usados
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
                  <td className="taller-td">#{orden.id}</td>
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

      {vistaActual === 'repuestos' && (
        <>
          <div className="taller-header">
            <h3 className="taller-subtitle">Repuestos Utilizados</h3>
            <button className="taller-btn-nuevo" onClick={() => setShowModalRepuesto(true)}>+ Registrar Repuesto</button>
          </div>
          <table className="taller-table">
            <thead>
              <tr>
                <th className="taller-th">Mantenimiento</th>
                <th className="taller-th">Repuesto</th>
                <th className="taller-th">Cantidad</th>
                <th className="taller-th">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {repuestos.map((r) => (
                <tr key={r.id} className="taller-tr">
                  <td className="taller-td">#{r.mantenimiento}</td>
                  <td className="taller-td">{r.repuesto_nombre}</td>
                  <td className="taller-td">{r.cantidad}</td>
                  <td className="taller-td">{r.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

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

            <div className="field">
              <label className="field-label">Estado</label>
              <select className="field-input" value={formOrden.estado} onChange={(e) => setFormOrden({ ...formOrden, estado: e.target.value })}>
                <option value="pendiente">Pendiente</option>
                <option value="en_proceso">En Proceso</option>
                <option value="finalizada">Finalizada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>

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
                  <option key={o.id} value={o.id}>#{o.id} - {o.estado}</option>
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

      {showModalRepuesto && (
        <div className="overlay">
          <div className="modal">
            <h3 className="modal-title">Registrar Repuesto Utilizado</h3>
            <div className="field">
              <label className="field-label">Mantenimiento</label>
              <select className="field-input" value={formRepuesto.mantenimiento} onChange={(e) => setFormRepuesto({ ...formRepuesto, mantenimiento: e.target.value })}>
                <option value="">Selecciona un mantenimiento</option>
                {mantenimientos.map((m) => (
                  <option key={m.id} value={m.id}>#{m.id} - {m.tipo_mantenimiento} - {m.lugar}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="field-label">Repuesto</label>
              <select className="field-input" value={formRepuesto.repuesto_id} onChange={(e) => setFormRepuesto({ ...formRepuesto, repuesto_id: e.target.value })}>
                <option value="">Selecciona un repuesto</option>
                {repuestosDisponibles.map((r) => (
                  <option key={r.id} value={r.id}>{r.nombre} (Stock: {r.stock})</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="field-label">Cantidad</label>
              <input className="field-input" type="number" value={formRepuesto.cantidad} onChange={(e) => setFormRepuesto({ ...formRepuesto, cantidad: e.target.value })} placeholder="Cantidad utilizada" />
            </div>
            <div className="modal-buttons">
              <button className="btn-cancelar" onClick={() => setShowModalRepuesto(false)}>Cancelar</button>
              <button className="btn-guardar" onClick={handleSubmitRepuesto}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Taller