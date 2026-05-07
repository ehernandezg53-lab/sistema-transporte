import { useState, useEffect } from 'react'
import api from '../../api/axios'
import './Bodega.css'

const Bodega = () => {
  const [repuestos, setRepuestos] = useState([])
  const [salidas, setSalidas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [vistaActual, setVistaActual] = useState('repuestos')
  const [showModal, setShowModal] = useState(false)
  const [showModalSalida, setShowModalSalida] = useState(false)
  const [repuestoEditando, setRepuestoEditando] = useState(null)
  const [form, setForm] = useState({ nombre: '', descripcion: '', stock: '' })
  const [formSalida, setFormSalida] = useState({ repuesto_id: '', cantidad: '', descripcion: '' })

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      const [repuestosRes, salidasRes] = await Promise.all([
        api.get('/bodega/repuestos/'),
        api.get('/bodega/salidas/'),
      ])
      setRepuestos(repuestosRes.data)
      setSalidas(salidasRes.data)
    } catch (err) {
      setError('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitRepuesto = async () => {
    try {
      if (repuestoEditando) {
        await api.put(`/bodega/repuestos/${repuestoEditando.id}/`, form)
      } else {
        await api.post('/bodega/repuestos/', form)
      }
      setShowModal(false)
      setRepuestoEditando(null)
      setForm({ nombre: '', descripcion: '', stock: '' })
      cargarDatos()
    } catch (err) {
      setError('Error al guardar el repuesto')
    }
  }

  const handleSubmitSalida = async () => {
    try {
      await api.post('/bodega/salidas/', formSalida)
      setShowModalSalida(false)
      setFormSalida({ repuesto_id: '', cantidad: '', descripcion: '' })
      cargarDatos()
    } catch (err) {
      setError('Error al registrar la salida. Verifique el stock disponible.')
    }
  }

  const handleEditar = (repuesto) => {
    setRepuestoEditando(repuesto)
    setForm({ nombre: repuesto.nombre, descripcion: repuesto.descripcion || '', stock: repuesto.stock })
    setShowModal(true)
  }

  const handleNuevo = () => {
    setRepuestoEditando(null)
    setForm({ nombre: '', descripcion: '', stock: '' })
    setShowModal(true)
  }

  if (loading) return <p className="bodega-loading">Cargando...</p>

  return (
    <div className="bodega-container">
      <h2 className="bodega-title">Gestión de Bodega de Repuestos</h2>

      {error && <p className="bodega-error">{error}</p>}

      <div className="bodega-tabs">
        <button
          className={vistaActual === 'repuestos' ? 'bodega-tab-activo' : 'bodega-tab'}
          onClick={() => setVistaActual('repuestos')}
        >
          Repuestos
        </button>
        <button
          className={vistaActual === 'salidas' ? 'bodega-tab-activo' : 'bodega-tab'}
          onClick={() => setVistaActual('salidas')}
        >
          Salidas
        </button>
      </div>

      {vistaActual === 'repuestos' && (
        <>
          <div className="bodega-header">
            <h3 className="bodega-subtitle">Lista de Repuestos</h3>
            <button className="bodega-btn-nuevo" onClick={handleNuevo}>
              + Nuevo Repuesto
            </button>
          </div>

          <table className="bodega-table">
            <thead>
              <tr>
                <th className="bodega-th">Nombre</th>
                <th className="bodega-th">Descripción</th>
                <th className="bodega-th">Stock</th>
                <th className="bodega-th">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {repuestos.map((repuesto) => (
                <tr key={repuesto.id} className="bodega-tr">
                  <td className="bodega-td">{repuesto.nombre}</td>
                  <td className="bodega-td">{repuesto.descripcion || '-'}</td>
                  <td className="bodega-td">
                    <span className={repuesto.stock > 0 ? 'stock-ok' : 'stock-bajo'}>
                      {repuesto.stock}
                    </span>
                  </td>
                  <td className="bodega-td">
                    <button className="btn-editar" onClick={() => handleEditar(repuesto)}>
                      Editar
                    </button>
                    <button
                      className="btn-salida"
                      onClick={() => {
                        setFormSalida({ repuesto_id: repuesto.id, cantidad: '', descripcion: '' })
                        setShowModalSalida(true)
                      }}
                    >
                      Registrar Salida
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {vistaActual === 'salidas' && (
        <>
          <div className="bodega-header">
            <h3 className="bodega-subtitle">Historial de Salidas</h3>
          </div>

          <table className="bodega-table">
            <thead>
              <tr>
                <th className="bodega-th">Repuesto</th>
                <th className="bodega-th">Cantidad</th>
                <th className="bodega-th">Fecha</th>
                <th className="bodega-th">Descripción</th>
              </tr>
            </thead>
            <tbody>
              {salidas.map((salida) => (
                <tr key={salida.id} className="bodega-tr">
                  <td className="bodega-td">{salida.repuesto_nombre}</td>
                  <td className="bodega-td">{salida.cantidad}</td>
                  <td className="bodega-td">{salida.fecha}</td>
                  <td className="bodega-td">{salida.descripcion || '-'}</td>
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
              {repuestoEditando ? 'Editar Repuesto' : 'Nuevo Repuesto'}
            </h3>

            <div className="field">
              <label className="field-label">Nombre</label>
              <input
                className="field-input"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Nombre del repuesto"
              />
            </div>

            <div className="field">
              <label className="field-label">Descripción</label>
              <textarea
                className="field-input"
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                placeholder="Descripción opcional"
              />
            </div>

            <div className="field">
              <label className="field-label">Stock</label>
              <input
                className="field-input"
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="Cantidad en stock"
              />
            </div>

            <div className="modal-buttons">
              <button className="btn-cancelar" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button className="btn-guardar" onClick={handleSubmitRepuesto}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {showModalSalida && (
        <div className="overlay">
          <div className="modal">
            <h3 className="modal-title">Registrar Salida de Repuesto</h3>

            <div className="field">
              <label className="field-label">Repuesto</label>
              <select
                className="field-input"
                value={formSalida.repuesto_id}
                onChange={(e) => setFormSalida({ ...formSalida, repuesto_id: e.target.value })}
              >
                <option value="">Selecciona un repuesto</option>
                {repuestos.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nombre} (Stock: {r.stock})
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label className="field-label">Cantidad</label>
              <input
                className="field-input"
                type="number"
                value={formSalida.cantidad}
                onChange={(e) => setFormSalida({ ...formSalida, cantidad: e.target.value })}
                placeholder="Cantidad a retirar"
              />
            </div>

            <div className="field">
              <label className="field-label">Descripción</label>
              <textarea
                className="field-input"
                value={formSalida.descripcion}
                onChange={(e) => setFormSalida({ ...formSalida, descripcion: e.target.value })}
                placeholder="Motivo de la salida"
              />
            </div>

            <div className="modal-buttons">
              <button className="btn-cancelar" onClick={() => setShowModalSalida(false)}>
                Cancelar
              </button>
              <button className="btn-guardar" onClick={handleSubmitSalida}>
                Registrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Bodega