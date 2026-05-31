import { useState, useEffect } from 'react'
import api from '../../api/axios'
import './Bodega.css'

const Bodega = () => {
  const [repuestos, setRepuestos] = useState([])
  const [ingresos, setIngresos] = useState([])
  const [salidas, setSalidas] = useState([])
  const [kardex, setKardex] = useState([])
  const [ubicaciones, setUbicaciones] = useState([])
  const [rollos, setRollos] = useState([])
  const [movimientosRollo, setMovimientosRollo] = useState([])
  const [ordenesActivas, setOrdenesActivas] = useState([])
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [vistaActual, setVistaActual] = useState('ingresos')
  
  const [showModalIngreso, setShowModalIngreso] = useState(false)
  const [showModalSalida, setShowModalSalida] = useState(false)
  const [showModalUbicacion, setShowModalUbicacion] = useState(false)
  const [showModalRollo, setShowModalRollo] = useState(false)
  const [showModalMovimientoRollo, setShowModalMovimientoRollo] = useState(false)
  
  const [tipoIngreso, setTipoIngreso] = useState('nuevo')
  const [repuestoFiltro, setRepuestoFiltro] = useState('')
  
  const [editandoUbicacion, setEditandoUbicacion] = useState(null)
  const [editandoRollo, setEditandoRollo] = useState(null)

  // Forms
  const [formNuevoRepuesto, setFormNuevoRepuesto] = useState({
    nombre: '', cantidad: ''
  })
  const [formIngresoExistente, setFormIngresoExistente] = useState({
    repuesto_id: '', cantidad: ''
  })
  const [formSalida, setFormSalida] = useState({
    repuesto_id: '', cantidad: '', descripcion: '', orden_id: ''
  })
  const [formUbicacion, setFormUbicacion] = useState({
    nombre: '', zona: ''
  })
  const [formRollo, setFormRollo] = useState({
    peso: '', estado: 'activo', ubicacion_id: ''
  })
  const [formMovimientoRollo, setFormMovimientoRollo] = useState({
    rollo_id: '', tipo_movimiento: 'ingreso', cantidad: 1, observacion: ''
  })

  useEffect(() => {
    cargarDatos()
  }, [])

  useEffect(() => {
    if (vistaActual === 'kardex') {
      cargarKardex()
    }
  }, [vistaActual, repuestoFiltro])

  const cargarDatos = async () => {
    try {
      const [repuestosRes, ingresosRes, salidasRes, ubicacionesRes, rollosRes, movimientosRes, ordenesRes] = await Promise.all([
        api.get('/bodega/repuestos/'),
        api.get('/bodega/ingresos/'),
        api.get('/bodega/salidas/'),
        api.get('/bodega/ubicaciones/'),
        api.get('/bodega/rollos/'),
        api.get('/bodega/movimientos-rollo/'),
        api.get('/taller/ordenes/'),
      ])
      setRepuestos(repuestosRes.data)
      setIngresos(ingresosRes.data)
      setSalidas(salidasRes.data)
      setUbicaciones(ubicacionesRes.data)
      setRollos(rollosRes.data)
      setMovimientosRollo(movimientosRes.data)
      setOrdenesActivas(ordenesRes.data.filter(o => o.estado === 'en_proceso'))
    } catch (err) {
      setError('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  const cargarKardex = async () => {
    try {
      const url = repuestoFiltro
        ? `/bodega/kardex/?repuesto_id=${repuestoFiltro}`
        : '/bodega/kardex/'
      const res = await api.get(url)
      setKardex(res.data)
    } catch (err) {
      setError('Error al cargar el kardex')
    }
  }

  const handleSubmitIngreso = async () => {
    try {
      if (tipoIngreso === 'nuevo') {
        const repuesto = await api.post('/bodega/repuestos/', {
          nombre: formNuevoRepuesto.nombre,
          stock: 0,
        })
        await api.post('/bodega/ingresos/', {
          repuesto_id: repuesto.data.id,
          cantidad: formNuevoRepuesto.cantidad,
        })
        setFormNuevoRepuesto({ nombre: '', cantidad: '' })
      } else {
        await api.post('/bodega/ingresos/', formIngresoExistente)
        setFormIngresoExistente({ repuesto_id: '', cantidad: '' })
      }
      setShowModalIngreso(false)
      cargarDatos()
    } catch (err) {
      setError('Error al registrar el ingreso')
    }
  }

  const handleSubmitSalida = async () => {
    if (!formSalida.orden_id) {
      setError('Debes seleccionar una Orden de Trabajo activa para registrar la salida.')
      return
    }
    try {
      setError('')
      await api.post('/bodega/salidas/', formSalida)
      setShowModalSalida(false)
      setFormSalida({ repuesto_id: '', cantidad: '', descripcion: '', orden_id: '' })
      cargarDatos()
    } catch (err) {
      const msg = err.response?.data?.non_field_errors?.[0] || err.response?.data?.detail || 'Error al registrar la salida. Verifique el stock disponible.'
      setError(msg)
    }
  }

  const handleSubmitUbicacion = async () => {
    try {
      if (editandoUbicacion) {
        await api.put(`/bodega/ubicaciones/${editandoUbicacion.id}/`, formUbicacion)
      } else {
        await api.post('/bodega/ubicaciones/', formUbicacion)
      }
      setShowModalUbicacion(false)
      setEditandoUbicacion(null)
      setFormUbicacion({ nombre: '', zona: '' })
      cargarDatos()
    } catch (err) {
      setError('Error al guardar la ubicación')
    }
  }

  const handleEditarUbicacion = (u) => {
    setEditandoUbicacion(u)
    setFormUbicacion({ nombre: u.nombre, zona: u.zona })
    setShowModalUbicacion(true)
  }

  const handleDeleteUbicacion = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta ubicación?')) {
      try {
        await api.delete(`/bodega/ubicaciones/${id}/`)
        cargarDatos()
      } catch (err) {
        setError('Error al eliminar la ubicación')
      }
    }
  }

  const handleSubmitRollo = async () => {
    try {
      if (editandoRollo) {
        await api.put(`/bodega/rollos/${editandoRollo.id}/`, formRollo)
      } else {
        await api.post('/bodega/rollos/', formRollo)
      }
      setShowModalRollo(false)
      setEditandoRollo(null)
      setFormRollo({ peso: '', estado: 'activo', ubicacion_id: '' })
      cargarDatos()
    } catch (err) {
      setError('Error al guardar el rollo')
    }
  }

  const handleEditarRollo = (r) => {
    setEditandoRollo(r)
    setFormRollo({ peso: r.peso, estado: r.estado, ubicacion_id: r.ubicacion_id || '' })
    setShowModalRollo(true)
  }

  const handleDeleteRollo = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este rollo?')) {
      try {
        await api.delete(`/bodega/rollos/${id}/`)
        cargarDatos()
      } catch (err) {
        setError('Error al eliminar el rollo')
      }
    }
  }

  const handleSubmitMovimientoRollo = async () => {
    try {
      await api.post('/bodega/movimientos-rollo/', formMovimientoRollo)
      setShowModalMovimientoRollo(false)
      setFormMovimientoRollo({ rollo_id: '', tipo_movimiento: 'ingreso', cantidad: 1, observacion: '' })
      cargarDatos()
    } catch (err) {
      setError('Error al registrar el movimiento de rollo')
    }
  }

  if (loading) return <p className="bodega-loading">Cargando...</p>

  return (
    <div className="bodega-container">
      <h2 className="bodega-title">Gestión de Bodega</h2>

      {error && <p className="bodega-error">{error}</p>}

      <div className="bodega-tabs">
        <button
          className={vistaActual === 'ingresos' ? 'bodega-tab-activo' : 'bodega-tab'}
          onClick={() => setVistaActual('ingresos')}
        >
          📥 Ingresos
        </button>
        <button
          className={vistaActual === 'salidas' ? 'bodega-tab-activo' : 'bodega-tab'}
          onClick={() => setVistaActual('salidas')}
        >
          📤 Salidas
        </button>
        <button
          className={vistaActual === 'kardex' ? 'bodega-tab-activo' : 'bodega-tab'}
          onClick={() => setVistaActual('kardex')}
        >
          📋 Kardex
        </button>
        <button
          className={vistaActual === 'inventario' ? 'bodega-tab-activo' : 'bodega-tab'}
          onClick={() => setVistaActual('inventario')}
        >
          📦 Inventario
        </button>
        <button
          className={vistaActual === 'ubicaciones' ? 'bodega-tab-activo' : 'bodega-tab'}
          onClick={() => setVistaActual('ubicaciones')}
        >
          📍 Ubicaciones
        </button>
        <button
          className={vistaActual === 'rollos' ? 'bodega-tab-activo' : 'bodega-tab'}
          onClick={() => setVistaActual('rollos')}
        >
          🧵 Rollos
        </button>
        <button
          className={vistaActual === 'movimientos-rollo' ? 'bodega-tab-activo' : 'bodega-tab'}
          onClick={() => setVistaActual('movimientos-rollo')}
        >
          🔄 Mov. Rollos
        </button>
      </div>

      {vistaActual === 'ingresos' && (
        <>
          <div className="bodega-header">
            <h3 className="bodega-subtitle">Registro de Ingresos de Repuestos</h3>
            <button className="bodega-btn-nuevo" onClick={() => setShowModalIngreso(true)}>
              + Registrar Ingreso
            </button>
          </div>
          <table className="bodega-table">
            <thead>
              <tr>
                <th className="bodega-th">Repuesto</th>
                <th className="bodega-th">Cantidad</th>
                <th className="bodega-th">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {ingresos.map((ingreso) => (
                <tr key={ingreso.id} className="bodega-tr">
                  <td className="bodega-td">{ingreso.repuesto_nombre}</td>
                  <td className="bodega-td">
                    <span className="stock-ok">+{ingreso.cantidad}</span>
                  </td>
                  <td className="bodega-td">{ingreso.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {vistaActual === 'salidas' && (
        <>
          <div className="bodega-header">
            <h3 className="bodega-subtitle">Registro de Salidas de Repuestos</h3>
            <button className="bodega-btn-nuevo" onClick={() => setShowModalSalida(true)}>
              + Registrar Salida
            </button>
          </div>
          <table className="bodega-table">
            <thead>
              <tr>
                <th className="bodega-th">Repuesto</th>
                <th className="bodega-th">Cantidad</th>
                <th className="bodega-th">Fecha</th>
                <th className="bodega-th">Justificación / Orden</th>
              </tr>
            </thead>
            <tbody>
              {salidas.map((salida) => (
                <tr key={salida.id} className="bodega-tr">
                  <td className="bodega-td">{salida.repuesto_nombre}</td>
                  <td className="bodega-td">
                    <span className="stock-bajo">-{salida.cantidad}</span>
                  </td>
                  <td className="bodega-td">{salida.fecha}</td>
                  <td className="bodega-td">
                    {salida.orden_numero ? `Orden: ${salida.orden_numero}` : salida.descripcion || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {vistaActual === 'kardex' && (
        <>
          <div className="bodega-header">
            <h3 className="bodega-subtitle">Kardex de Repuestos</h3>
            <select
              className="bodega-filtro"
              value={repuestoFiltro}
              onChange={(e) => setRepuestoFiltro(e.target.value)}
            >
              <option value="">Todos los repuestos</option>
              {repuestos.map((r) => (
                <option key={r.id} value={r.id}>{r.nombre}</option>
              ))}
            </select>
          </div>
          <table className="bodega-table">
            <thead>
              <tr>
                <th className="bodega-th">Repuesto</th>
                <th className="bodega-th">Tipo</th>
                <th className="bodega-th">Cantidad</th>
                <th className="bodega-th">Stock Anterior</th>
                <th className="bodega-th">Stock Actual</th>
                <th className="bodega-th">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {kardex.map((k) => (
                <tr key={k.id} className="bodega-tr">
                  <td className="bodega-td">{k.repuesto_nombre}</td>
                  <td className="bodega-td">
                    <span className={k.tipo === 'ingreso' ? 'stock-ok' : 'stock-bajo'}>
                      {k.tipo}
                    </span>
                  </td>
                  <td className="bodega-td">
                    {k.tipo === 'ingreso' ? `+${k.cantidad}` : `-${k.cantidad}`}
                  </td>
                  <td className="bodega-td">{k.stock_anterior}</td>
                  <td className="bodega-td">{k.stock_actual}</td>
                  <td className="bodega-td">{new Date(k.fecha).toLocaleString('es-GT')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {vistaActual === 'inventario' && (
        <>
          <div className="bodega-header">
            <h3 className="bodega-subtitle">Inventario General de Repuestos</h3>
          </div>
          <table className="bodega-table">
            <thead>
              <tr>
                <th className="bodega-th">#</th>
                <th className="bodega-th">Nombre</th>
                <th className="bodega-th">Descripción</th>
                <th className="bodega-th">Stock</th>
                <th className="bodega-th">Estado</th>
              </tr>
            </thead>
            <tbody>
              {repuestos.map((r, index) => (
                <tr key={r.id} className="bodega-tr">
                  <td className="bodega-td">{index + 1}</td>
                  <td className="bodega-td">{r.nombre}</td>
                  <td className="bodega-td">{r.descripcion || '-'}</td>
                  <td className="bodega-td">{r.stock}</td>
                  <td className="bodega-td">
                    <span className={r.stock > 0 ? 'stock-ok' : 'stock-bajo'}>
                      {r.stock > 0 ? 'Disponible' : 'Sin stock'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {vistaActual === 'ubicaciones' && (
        <>
          <div className="bodega-header">
            <h3 className="bodega-subtitle">Ubicaciones de Bodega</h3>
            <button className="bodega-btn-nuevo" onClick={() => { setEditandoUbicacion(null); setFormUbicacion({ nombre: '', zona: '' }); setShowModalUbicacion(true); }}>
              + Nueva Ubicación
            </button>
          </div>
          <table className="bodega-table">
            <thead>
              <tr>
                <th className="bodega-th">Nombre de Ubicación</th>
                <th className="bodega-th">Zona / Sección</th>
                <th className="bodega-th">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ubicaciones.map((u) => (
                <tr key={u.id} className="bodega-tr">
                  <td className="bodega-td">{u.nombre}</td>
                  <td className="bodega-td">{u.zona}</td>
                  <td className="bodega-td">
                    <button className="btn-editar" onClick={() => handleEditarUbicacion(u)}>Editar</button>
                    <button className="btn-salida" onClick={() => handleDeleteUbicacion(u.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {vistaActual === 'rollos' && (
        <>
          <div className="bodega-header">
            <h3 className="bodega-subtitle">Rollos de Alambre</h3>
            <button className="bodega-btn-nuevo" onClick={() => { setEditandoRollo(null); setFormRollo({ peso: '', estado: 'activo', ubicacion_id: '' }); setShowModalRollo(true); }}>
              + Registrar Rollo
            </button>
          </div>
          <table className="bodega-table">
            <thead>
              <tr>
                <th className="bodega-th">Código de Rollo</th>
                <th className="bodega-th">Peso (kg)</th>
                <th className="bodega-th">Estado</th>
                <th className="bodega-th">Ubicación</th>
                <th className="bodega-th">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rollos.map((r) => (
                <tr key={r.id} className="bodega-tr">
                  <td className="bodega-td"><strong>Rollo #{r.id}</strong></td>
                  <td className="bodega-td">{r.peso} kg</td>
                  <td className="bodega-td">
                    <span className={r.estado === 'activo' ? 'stock-ok' : r.estado === 'entregado' ? 'stock-bajo' : 'stock-bajo'}>
                      {r.estado}
                    </span>
                  </td>
                  <td className="bodega-td">
                    {r.ubicacion_nombre ? `${r.ubicacion_nombre} (${r.ubicacion_zona})` : 'Sin asignar'}
                  </td>
                  <td className="bodega-td">
                    <button className="btn-editar" onClick={() => handleEditarRollo(r)}>Editar</button>
                    <button className="btn-salida" onClick={() => handleDeleteRollo(r.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {vistaActual === 'movimientos-rollo' && (
        <>
          <div className="bodega-header">
            <h3 className="bodega-subtitle">Movimientos de Rollos</h3>
            <button className="bodega-btn-nuevo" onClick={() => setShowModalMovimientoRollo(true)}>
              + Registrar Movimiento
            </button>
          </div>
          <table className="bodega-table">
            <thead>
              <tr>
                <th className="bodega-th">Rollo</th>
                <th className="bodega-th">Peso</th>
                <th className="bodega-th">Tipo Movimiento</th>
                <th className="bodega-th">Cantidad</th>
                <th className="bodega-th">Observaciones</th>
                <th className="bodega-th">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {movimientosRollo.map((m) => (
                <tr key={m.id} className="bodega-tr">
                  <td className="bodega-td">Rollo #{m.rollo_id}</td>
                  <td className="bodega-td">{m.rollo_peso} kg</td>
                  <td className="bodega-td">
                    <span className={m.tipo_movimiento === 'ingreso' ? 'stock-ok' : m.tipo_movimiento === 'salida' ? 'stock-bajo' : 'stock-ok'}>
                      {m.tipo_movimiento}
                    </span>
                  </td>
                  <td className="bodega-td">{m.cantidad}</td>
                  <td className="bodega-td">{m.observacion || '-'}</td>
                  <td className="bodega-td">{new Date(m.fecha).toLocaleString('es-GT')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Modals */}
      {showModalIngreso && (
        <div className="overlay">
          <div className="modal">
            <h3 className="modal-title">Registrar Ingreso de Repuesto</h3>
            <div className="bodega-tipo-ingreso">
              <button
                className={tipoIngreso === 'nuevo' ? 'bodega-tab-activo' : 'bodega-tab'}
                onClick={() => setTipoIngreso('nuevo')}
              >
                Nuevo repuesto
              </button>
              <button
                className={tipoIngreso === 'existente' ? 'bodega-tab-activo' : 'bodega-tab'}
                onClick={() => setTipoIngreso('existente')}
              >
                Repuesto existente
              </button>
            </div>

            {tipoIngreso === 'nuevo' && (
              <>
                <div className="field">
                  <label className="field-label">Nombre del repuesto</label>
                  <input
                    className="field-input"
                    value={formNuevoRepuesto.nombre}
                    onChange={(e) => setFormNuevoRepuesto({ ...formNuevoRepuesto, nombre: e.target.value })}
                    placeholder="Nombre del repuesto"
                  />
                </div>
                <div className="field">
                  <label className="field-label">Cantidad inicial</label>
                  <input
                    className="field-input"
                    type="number"
                    value={formNuevoRepuesto.cantidad}
                    onChange={(e) => setFormNuevoRepuesto({ ...formNuevoRepuesto, cantidad: e.target.value })}
                    placeholder="Cantidad a ingresar"
                  />
                </div>
              </>
            )}

            {tipoIngreso === 'existente' && (
              <>
                <div className="field">
                  <label className="field-label">Repuesto</label>
                  <select
                    className="field-input"
                    value={formIngresoExistente.repuesto_id}
                    onChange={(e) => setFormIngresoExistente({ ...formIngresoExistente, repuesto_id: e.target.value })}
                  >
                    <option value="">Selecciona un repuesto</option>
                    {repuestos.map((r) => (
                      <option key={r.id} value={r.id}>{r.nombre} (Stock actual: {r.stock})</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label className="field-label">Cantidad a ingresar</label>
                  <input
                    className="field-input"
                    type="number"
                    value={formIngresoExistente.cantidad}
                    onChange={(e) => setFormIngresoExistente({ ...formIngresoExistente, cantidad: e.target.value })}
                    placeholder="Cantidad a ingresar"
                  />
                </div>
              </>
            )}

            <div className="modal-buttons">
              <button className="btn-cancelar" onClick={() => setShowModalIngreso(false)}>Cancelar</button>
              <button className="btn-guardar" onClick={handleSubmitIngreso}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {showModalSalida && (
        <div className="overlay">
          <div className="modal">
            <h3 className="modal-title">Registrar Salida de Repuesto</h3>

            <div className="field">
              <label className="field-label">Orden de Trabajo Activa <span style={{color:'#dc3545'}}>*</span></label>
              <select
                className="field-input"
                value={formSalida.orden_id}
                onChange={(e) => setFormSalida({ ...formSalida, orden_id: e.target.value })}
              >
                <option value="">Selecciona una orden en proceso</option>
                {ordenesActivas.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.numero_orden} — {o.vehiculo_placa || 'Sin vehículo'} ({o.estado.replace('_', ' ')})
                  </option>
                ))}
              </select>
              {ordenesActivas.length === 0 && (
                <small style={{color:'#dc3545'}}>No hay órdenes en proceso de reparación.</small>
              )}
            </div>

            <div className="field">
              <label className="field-label">Repuesto</label>
              <select
                className="field-input"
                value={formSalida.repuesto_id}
                onChange={(e) => setFormSalida({ ...formSalida, repuesto_id: e.target.value })}
              >
                <option value="">Selecciona un repuesto</option>
                {repuestos.filter(r => r.stock > 0).map((r) => (
                  <option key={r.id} value={r.id}>{r.nombre} (Stock: {r.stock})</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label className="field-label">Cantidad</label>
              <input
                className="field-input"
                type="number"
                min="1"
                value={formSalida.cantidad}
                onChange={(e) => setFormSalida({ ...formSalida, cantidad: e.target.value })}
                placeholder="Cantidad a retirar"
              />
            </div>

            <div className="field">
              <label className="field-label">Justificación (opcional)</label>
              <textarea
                className="field-input"
                value={formSalida.descripcion}
                onChange={(e) => setFormSalida({ ...formSalida, descripcion: e.target.value })}
                placeholder="Observaciones adicionales..."
                rows={2}
              />
            </div>

            <div className="modal-buttons">
              <button className="btn-cancelar" onClick={() => { setShowModalSalida(false); setError('') }}>Cancelar</button>
              <button className="btn-guardar" onClick={handleSubmitSalida}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {showModalUbicacion && (
        <div className="overlay">
          <div className="modal">
            <h3 className="modal-title">{editandoUbicacion ? 'Editar Ubicación' : 'Nueva Ubicación'}</h3>
            <div className="field">
              <label className="field-label">Nombre de Ubicación</label>
              <input
                className="field-input"
                value={formUbicacion.nombre}
                onChange={(e) => setFormUbicacion({ ...formUbicacion, nombre: e.target.value })}
                placeholder="Ej. Pasillo A, Estantería 3"
              />
            </div>
            <div className="field">
              <label className="field-label">Zona / Sección</label>
              <input
                className="field-input"
                value={formUbicacion.zona}
                onChange={(e) => setFormUbicacion({ ...formUbicacion, zona: e.target.value })}
                placeholder="Ej. Bodega Central, Zona Norte"
              />
            </div>
            <div className="modal-buttons">
              <button className="btn-cancelar" onClick={() => setShowModalUbicacion(false)}>Cancelar</button>
              <button className="btn-guardar" onClick={handleSubmitUbicacion}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {showModalRollo && (
        <div className="overlay">
          <div className="modal">
            <h3 className="modal-title">{editandoRollo ? 'Editar Rollo' : 'Registrar Rollo'}</h3>
            <div className="field">
              <label className="field-label">Peso (kg)</label>
              <input
                className="field-input"
                type="number"
                step="0.01"
                value={formRollo.peso}
                onChange={(e) => setFormRollo({ ...formRollo, peso: e.target.value })}
                placeholder="Ej. 25.5"
              />
            </div>
            <div className="field">
              <label className="field-label">Estado</label>
              <select
                className="field-input"
                value={formRollo.estado}
                onChange={(e) => setFormRollo({ ...formRollo, estado: e.target.value })}
              >
                <option value="activo">Activo</option>
                <option value="entregado">Entregado</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
            <div className="field">
              <label className="field-label">Ubicación</label>
              <select
                className="field-input"
                value={formRollo.ubicacion_id}
                onChange={(e) => setFormRollo({ ...formRollo, ubicacion_id: e.target.value })}
              >
                <option value="">Selecciona ubicación</option>
                {ubicaciones.map((u) => (
                  <option key={u.id} value={u.id}>{u.nombre} ({u.zona})</option>
                ))}
              </select>
            </div>
            <div className="modal-buttons">
              <button className="btn-cancelar" onClick={() => setShowModalRollo(false)}>Cancelar</button>
              <button className="btn-guardar" onClick={handleSubmitRollo}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {showModalMovimientoRollo && (
        <div className="overlay">
          <div className="modal">
            <h3 className="modal-title">Registrar Movimiento de Rollo</h3>
            <div className="field">
              <label className="field-label">Rollo</label>
              <select
                className="field-input"
                value={formMovimientoRollo.rollo_id}
                onChange={(e) => setFormMovimientoRollo({ ...formMovimientoRollo, rollo_id: e.target.value })}
              >
                <option value="">Selecciona rollo</option>
                {rollos.filter(r => r.estado === 'activo').map((r) => (
                  <option key={r.id} value={r.id}>Rollo #{r.id} ({r.peso} kg)</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="field-label">Tipo Movimiento</label>
              <select
                className="field-input"
                value={formMovimientoRollo.tipo_movimiento}
                onChange={(e) => setFormMovimientoRollo({ ...formMovimientoRollo, tipo_movimiento: e.target.value })}
              >
                <option value="ingreso">Ingreso</option>
                <option value="traslado">Traslado</option>
              </select>
            </div>
            <div className="field">
              <label className="field-label">Cantidad (Rollos)</label>
              <input
                className="field-input"
                type="number"
                value={formMovimientoRollo.cantidad}
                onChange={(e) => setFormMovimientoRollo({ ...formMovimientoRollo, cantidad: e.target.value })}
                placeholder="Cantidad de rollos"
              />
            </div>
            <div className="field">
              <label className="field-label">Observaciones</label>
              <textarea
                className="field-input"
                value={formMovimientoRollo.observacion}
                onChange={(e) => setFormMovimientoRollo({ ...formMovimientoRollo, observacion: e.target.value })}
                placeholder="Detalle o justificación..."
                rows={3}
              />
            </div>
            <div className="modal-buttons">
              <button className="btn-cancelar" onClick={() => setShowModalMovimientoRollo(false)}>Cancelar</button>
              <button className="btn-guardar" onClick={handleSubmitMovimientoRollo}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Bodega