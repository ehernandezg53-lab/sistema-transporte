from django.urls import path
from .views import (
    ListarCrearVehiculosView,
    DetalleVehiculoView,
    ListarCrearConductoresView,
    DetalleConductorView,
    ListarCrearRutasView,
    DetalleRutaView,
    ListarCrearEntregasView,
)

urlpatterns = [
    path('vehiculos/', ListarCrearVehiculosView.as_view(), name='vehiculos'),
    path('vehiculos/<int:pk>/', DetalleVehiculoView.as_view(), name='detalle-vehiculo'),
    path('conductores/', ListarCrearConductoresView.as_view(), name='conductores'),
    path('conductores/<int:pk>/', DetalleConductorView.as_view(), name='detalle-conductor'),
    path('rutas/', ListarCrearRutasView.as_view(), name='rutas'),
    path('rutas/<int:pk>/', DetalleRutaView.as_view(), name='detalle-ruta'),
    path('entregas/', ListarCrearEntregasView.as_view(), name='entregas'),
]