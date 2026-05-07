from django.urls import path
from .views import (
    ListarCrearOrdenesView,
    DetalleOrdenView,
    ListarCrearMantenimientosView,
    ListarCrearRepuestosTallerView,
)

urlpatterns = [
    path('ordenes/', ListarCrearOrdenesView.as_view(), name='ordenes'),
    path('ordenes/<int:pk>/', DetalleOrdenView.as_view(), name='detalle-orden'),
    path('mantenimientos/', ListarCrearMantenimientosView.as_view(), name='mantenimientos'),
    path('repuestos/', ListarCrearRepuestosTallerView.as_view(), name='repuestos-taller'),
]