import { useState, useEffect } from 'react'
import api from '../../api/axios'
import './Reportes.css'

const Reportes = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    cargarReportes()
  }, [])

  const cargarReportes = async () => {
    try {
      const res = await api.get('/users/reports/dashboard/')
      setData(res.data)
    } catch (err) {
      setError('Error al cargar las estadísticas del sistema')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p className="reportes-loading">Cargando estadísticas...</p>
  if (error) return <p className="reportes-error">{error}</p>
  if (!data) return <p className="reportes-error">No se encontraron datos</p>

  const { bodega, taller, transporte, usuarios } = data

  // Helpers to calculate percentages for visual progress bars
  const calcPercent = (val, total) => {
    if (!total || total === 0) return 0
    return Math.round((val / total) * 100)
  }

  return (
    <div className="reportes-container">
      <h2 className="reportes-title">📊 Panel de Reportes y Estadísticas</h2>

      {/* Alertas de inventario crítico */}
      {bodega.repuestos_bajo_stock && bodega.repuestos_bajo_stock.length > 0 && (
        <div className="reportes-alert-box">
          <h4 style={{ color: '#721c24', margin: '0 0 10px 0' }}>⚠️ Alerta de Inventario Crítico (Bajo Stock)</h4>
          <ul className="alert-list">
            {bodega.repuestos_bajo_stock.map(r => (
              <li key={r.id} className="alert-item">
                El repuesto <strong>{r.nombre}</strong> tiene stock bajo: <span className="badge-critical">{r.stock} unidades</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="reportes-grid">
        <div className="reportes-card">
          <h3>📦 Repuestos Totales</h3>
          <p className="card-number">{bodega.total_repuestos}</p>
          <span className="card-desc">Repuestos en catálogo</span>
        </div>
        <div className="reportes-card">
          <h3>🧵 Rollos en Bodega</h3>
          <p className="card-number">{bodega.total_rollos}</p>
          <span className="card-desc">Materia prima registrada</span>
        </div>
        <div className="reportes-card">
          <h3>🔧 Órdenes de Trabajo</h3>
          <p className="card-number">{taller.total_ordenes}</p>
          <span className="card-desc">Órdenes generadas en Taller</span>
        </div>
        <div className="reportes-card">
          <h3>🗺️ Rutas Registradas</h3>
          <p className="card-number">{transporte.total_rutas}</p>
          <span className="card-desc">Viajes y destinos</span>
        </div>
        <div className="reportes-card">
          <h3>👥 Usuarios Totales</h3>
          <p className="card-number">{usuarios.total_usuarios}</p>
          <span className="card-desc">Usuarios registrados</span>
        </div>
      </div>

      <div className="reportes-charts-section">
        {/* Órdenes de Trabajo progress bars */}
        <div className="chart-card">
          <h4>📋 Órdenes de Trabajo por Estado</h4>
          <div className="progress-container">
            <div className="progress-item">
              <div className="progress-label">
                <span>Pendiente ({taller.ordenes_por_estado.pendiente})</span>
                <span>{calcPercent(taller.ordenes_por_estado.pendiente, taller.total_ordenes)}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill bar-pendiente" style={{ width: `${calcPercent(taller.ordenes_por_estado.pendiente, taller.total_ordenes)}%` }}></div>
              </div>
            </div>

            <div className="progress-item">
              <div className="progress-label">
                <span>En Proceso ({taller.ordenes_por_estado.en_proceso})</span>
                <span>{calcPercent(taller.ordenes_por_estado.en_proceso, taller.total_ordenes)}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill bar-proceso" style={{ width: `${calcPercent(taller.ordenes_por_estado.en_proceso, taller.total_ordenes)}%` }}></div>
              </div>
            </div>

            <div className="progress-item">
              <div className="progress-label">
                <span>Finalizada ({taller.ordenes_por_estado.finalizada})</span>
                <span>{calcPercent(taller.ordenes_por_estado.finalizada, taller.total_ordenes)}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill bar-finalizada" style={{ width: `${calcPercent(taller.ordenes_por_estado.finalizada, taller.total_ordenes)}%` }}></div>
              </div>
            </div>

            <div className="progress-item">
              <div className="progress-label">
                <span>Cancelada ({taller.ordenes_por_estado.cancelada})</span>
                <span>{calcPercent(taller.ordenes_por_estado.cancelada, taller.total_ordenes)}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill bar-cancelada" style={{ width: `${calcPercent(taller.ordenes_por_estado.cancelada, taller.total_ordenes)}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Transporte / Rutas progress bars */}
        <div className="chart-card">
          <h4>🚛 Rutas de Transporte por Estado</h4>
          <div className="progress-container">
            <div className="progress-item">
              <div className="progress-label">
                <span>Pendiente ({transporte.rutas_por_estado.pendiente})</span>
                <span>{calcPercent(transporte.rutas_por_estado.pendiente, transporte.total_rutas)}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill bar-pendiente" style={{ width: `${calcPercent(transporte.rutas_por_estado.pendiente, transporte.total_rutas)}%` }}></div>
              </div>
            </div>

            <div className="progress-item">
              <div className="progress-label">
                <span>En Proceso ({transporte.rutas_por_estado.en_proceso})</span>
                <span>{calcPercent(transporte.rutas_por_estado.en_proceso, transporte.total_rutas)}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill bar-proceso" style={{ width: `${calcPercent(transporte.rutas_por_estado.en_proceso, transporte.total_rutas)}%` }}></div>
              </div>
            </div>

            <div className="progress-item">
              <div className="progress-label">
                <span>Finalizada ({transporte.rutas_por_estado.finalizada})</span>
                <span>{calcPercent(transporte.rutas_por_estado.finalizada, transporte.total_rutas)}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill bar-finalizada" style={{ width: `${calcPercent(transporte.rutas_por_estado.finalizada, transporte.total_rutas)}%` }}></div>
              </div>
            </div>

            <div className="progress-item">
              <div className="progress-label">
                <span>Cancelada ({transporte.rutas_por_estado.cancelada})</span>
                <span>{calcPercent(transporte.rutas_por_estado.cancelada, transporte.total_rutas)}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill bar-cancelada" style={{ width: `${calcPercent(transporte.rutas_por_estado.cancelada, transporte.total_rutas)}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Rollos de Tela por estado */}
        <div className="chart-card">
          <h4>🧵 Distribución de Rollos de Tela</h4>
          <div className="progress-container">
            <div className="progress-item">
              <div className="progress-label">
                <span>Activo ({bodega.rollos_por_estado.activo})</span>
                <span>{calcPercent(bodega.rollos_por_estado.activo, bodega.total_rollos)}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill bar-finalizada" style={{ width: `${calcPercent(bodega.rollos_por_estado.activo, bodega.total_rollos)}%` }}></div>
              </div>
            </div>

            <div className="progress-item">
              <div className="progress-label">
                <span>Entregado ({bodega.rollos_por_estado.entregado})</span>
                <span>{calcPercent(bodega.rollos_por_estado.entregado, bodega.total_rollos)}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill bar-pendiente" style={{ width: `${calcPercent(bodega.rollos_por_estado.entregado, bodega.total_rollos)}%` }}></div>
              </div>
            </div>

            <div className="progress-item">
              <div className="progress-label">
                <span>Inactivo ({bodega.rollos_por_estado.inactivo})</span>
                <span>{calcPercent(bodega.rollos_por_estado.inactivo, bodega.total_rollos)}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill bar-cancelada" style={{ width: `${calcPercent(bodega.rollos_por_estado.inactivo, bodega.total_rollos)}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Vehículos por estado */}
        <div className="chart-card">
          <h4>🚛 Estado de Vehículos</h4>
          <div className="progress-container">
            <div className="progress-item">
              <div className="progress-label">
                <span>Activo ({transporte.vehiculos_por_estado.activo})</span>
                <span>{calcPercent(transporte.vehiculos_por_estado.activo, transporte.total_vehiculos)}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill bar-finalizada" style={{ width: `${calcPercent(transporte.vehiculos_por_estado.activo, transporte.total_vehiculos)}%` }}></div>
              </div>
            </div>

            <div className="progress-item">
              <div className="progress-label">
                <span>Inactivo ({transporte.vehiculos_por_estado.inactivo})</span>
                <span>{calcPercent(transporte.vehiculos_por_estado.inactivo, transporte.total_vehiculos)}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill bar-cancelada" style={{ width: `${calcPercent(transporte.vehiculos_por_estado.inactivo, transporte.total_vehiculos)}%` }}></div>
              </div>
            </div>

            <div className="progress-item">
              <div className="progress-label">
                <span>En Mantenimiento ({transporte.vehiculos_por_estado.en_mantenimiento})</span>
                <span>{calcPercent(transporte.vehiculos_por_estado.en_mantenimiento, transporte.total_vehiculos)}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill bar-proceso" style={{ width: `${calcPercent(transporte.vehiculos_por_estado.en_mantenimiento, transporte.total_vehiculos)}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '24px' }}>
        <h3>👥 Distribución de Usuarios por Rol</h3>
        <table className="reportes-table">
          <thead>
            <tr>
              <th className="reportes-th">Rol</th>
              <th className="reportes-th">Cantidad de Usuarios</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(usuarios.usuarios_por_rol).map((rol) => (
              <tr key={rol} className="reportes-tr">
                <td className="reportes-td"><strong>{rol}</strong></td>
                <td className="reportes-td">{usuarios.usuarios_por_rol[rol]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Reportes
