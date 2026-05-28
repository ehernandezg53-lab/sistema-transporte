from django.urls import path
from .views import (
    ListarCrearOrdenesView,
    DetalleOrdenView,
    BuscarOrdenView,
    ListarCrearMantenimientosView,
    ListarCrearMecanicosView,
    DetalleMecanicoView,
)

urlpatterns = [
    path('ordenes/', ListarCrearOrdenesView.as_view(), name='ordenes'),
    path('ordenes/<int:pk>/', DetalleOrdenView.as_view(), name='detalle-orden'),
    path('ordenes/buscar/', BuscarOrdenView.as_view(), name='buscar-orden'),
    path('mantenimientos/', ListarCrearMantenimientosView.as_view(), name='mantenimientos'),
    path('mecanicos/', ListarCrearMecanicosView.as_view(), name='mecanicos'),
    path('mecanicos/<int:pk>/', DetalleMecanicoView.as_view(), name='detalle-mecanico'),
]