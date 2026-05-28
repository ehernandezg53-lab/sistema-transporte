from django.urls import path
from .views import (
    ListarCrearRepuestosView,
    DetalleRepuestoView,
    ListarCrearIngresosView,
    ListarCrearSalidasView,
    ListarKardexView,
    ListarCrearUbicacionesView,
    DetalleUbicacionView,
    ListarCrearRollosView,
    DetalleRolloView,
    ListarCrearMovimientosRolloView,
)

urlpatterns = [
    path('repuestos/', ListarCrearRepuestosView.as_view(), name='repuestos'),
    path('repuestos/<int:pk>/', DetalleRepuestoView.as_view(), name='detalle-repuesto'),
    path('ingresos/', ListarCrearIngresosView.as_view(), name='ingresos'),
    path('salidas/', ListarCrearSalidasView.as_view(), name='salidas'),
    path('kardex/', ListarKardexView.as_view(), name='kardex'),
    
    # Nuevas rutas
    path('ubicaciones/', ListarCrearUbicacionesView.as_view(), name='ubicaciones'),
    path('ubicaciones/<int:pk>/', DetalleUbicacionView.as_view(), name='detalle-ubicacion'),
    path('rollos/', ListarCrearRollosView.as_view(), name='rollos'),
    path('rollos/<int:pk>/', DetalleRolloView.as_view(), name='detalle-rollo'),
    path('movimientos-rollo/', ListarCrearMovimientosRolloView.as_view(), name='movimientos-rollo'),
]