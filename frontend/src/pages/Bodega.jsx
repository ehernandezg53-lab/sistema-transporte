import { useState, useEffect } from 'react'
import api from '../api/axios'

const Bodega = () => {
  const [repuestos, setRepuestos] = useState([])
  const [salidas, setSalidas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [vistaActual, setVistaActual] = useState('repuestos')
  const [showModal, setShowModal] = useState(false)
  const [showModalSalida, setShowModalSalida] = useState(false)
  const [repuestoEditando, setRepuestoEditando] = useState(null)
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    stock: '',
  })
  const [formSalida, setFormSalida] = useState({
    repuesto_id: '',
    cantidad: '',
    descripcion: '',
  })

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
    setForm({
      nombre: repuesto.nombre,
      descripcion: repuesto.descripcion || '',
      stock: repuesto.stock,
    })
    setShowModal(true)
  }

  const handleNuevo = () => {
    setRepuestoEditando(null)
    setForm({ nombre: '', descripcion: '', stock: '' })
    setShowModal(true)
  }

  if (loading) return <p style={styles.loading}>Cargando...</p>

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Gestión de Bodega de Repuestos</h2>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.tabs}>
        <button
          style={vistaActual === 'repuestos' ? styles.tabActivo : styles.tab}
          onClick={() => setVistaActual('repuestos')}
        >
          Repuestos
        </button>
        <button
          style={vistaActual === 'salidas' ? styles.tabActivo : styles.tab}
          onClick={() => setVistaActual('salidas')}
        >
          Salidas
        </button>
      </div>

      {vistaActual === 'repuestos' && (
        <>
          <div style={styles.header}>
            <h3 style={styles.subtitle}>Lista de Repuestos</h3>
            <button style={styles.btnNuevo} onClick={handleNuevo}>
              + Nuevo Repuesto
            </button>
          </div>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Nombre</th>
                <th style={styles.th}>Descripción</th>
                <th style={styles.th}>Stock</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {repuestos.map((repuesto) => (
                <tr key={repuesto.id} style={styles.tr}>
                  <td style={styles.td}>{repuesto.nombre}</td>
                  <td style={styles.td}>{repuesto.descripcion || '-'}</td>
                  <td style={styles.td}>
                    <span style={repuesto.stock > 0 ? styles.stockOk : styles.stockBajo}>
                      {repuesto.stock}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button style={styles.btnEditar} onClick={() => handleEditar(repuesto)}>
                      Editar
                    </button>
                    <button
                      style={styles.btnSalida}
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
          <div style={styles.header}>
            <h3 style={styles.subtitle}>Historial de Salidas</h3>
          </div>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Repuesto</th>
                <th style={styles.th}>Cantidad</th>
                <th style={styles.th}>Fecha</th>
                <th style={styles.th}>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {salidas.map((salida) => (
                <tr key={salida.id} style={styles.tr}>
                  <td style={styles.td}>{salida.repuesto_nombre}</td>
                  <td style={styles.td}>{salida.cantidad}</td>
                  <td style={styles.td}>{salida.fecha}</td>
                  <td style={styles.td}>{salida.descripcion || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>
              {repuestoEditando ? 'Editar Repuesto' : 'Nuevo Repuesto'}
            </h3>

            <div style={styles.field}>
              <label style={styles.label}>Nombre</label>
              <input
                style={styles.input}
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Nombre del repuesto"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Descripción</label>
              <textarea
                style={styles.input}
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                placeholder="Descripción opcional"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Stock</label>
              <input
                style={styles.input}
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="Cantidad en stock"
              />
            </div>

            <div style={styles.modalButtons}>
              <button style={styles.btnCancelar} onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button style={styles.btnGuardar} onClick={handleSubmitRepuesto}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {showModalSalida && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Registrar Salida de Repuesto</h3>

            <div style={styles.field}>
              <label style={styles.label}>Repuesto</label>
              <select
                style={styles.input}
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

            <div style={styles.field}>
              <label style={styles.label}>Cantidad</label>
              <input
                style={styles.input}
                type="number"
                value={formSalida.cantidad}
                onChange={(e) => setFormSalida({ ...formSalida, cantidad: e.target.value })}
                placeholder="Cantidad a retirar"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Descripción</label>
              <textarea
                style={styles.input}
                value={formSalida.descripcion}
                onChange={(e) => setFormSalida({ ...formSalida, descripcion: e.target.value })}
                placeholder="Motivo de la salida"
              />
            </div>

            <div style={styles.modalButtons}>
              <button style={styles.btnCancelar} onClick={() => setShowModalSalida(false)}>
                Cancelar
              </button>
              <button style={styles.btnGuardar} onClick={handleSubmitSalida}>
                Registrar
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
  title: { color: '#1a1a2e', marginBottom: '24px' },
  subtitle: { margin: 0, color: '#1a1a2e' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  tabs: { display: 'flex', gap: '8px', marginBottom: '24px' },
  tab: { padding: '10px 20px', backgroundColor: '#e0e0e0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  tabActivo: { padding: '10px 20px', backgroundColor: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  btnNuevo: { padding: '10px 20px', backgroundColor: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' },
  th: { padding: '14px 16px', backgroundColor: '#1a1a2e', color: '#fff', textAlign: 'left' },
  tr: { borderBottom: '1px solid #eee' },
  td: { padding: '12px 16px', color: '#333' },
  stockOk: { backgroundColor: '#d4edda', color: '#155724', padding: '4px 10px', borderRadius: '12px', fontSize: '12px' },
  stockBajo: { backgroundColor: '#f8d7da', color: '#721c24', padding: '4px 10px', borderRadius: '12px', fontSize: '12px' },
  btnEditar: { marginRight: '8px', padding: '6px 12px', backgroundColor: '#f0ad4e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  btnSalida: { padding: '6px 12px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
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

export default Bodega