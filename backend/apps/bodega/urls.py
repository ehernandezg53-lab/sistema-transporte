from django.urls import path
from .views import (
    ListarCrearRepuestosView,
    DetalleRepuestoView,
    ListarCrearSalidasView,
)

urlpatterns = [
    path('repuestos/', ListarCrearRepuestosView.as_view(), name='repuestos'),
    path('repuestos/<int:pk>/', DetalleRepuestoView.as_view(), name='detalle-repuesto'),
    path('salidas/', ListarCrearSalidasView.as_view(), name='salidas'),
]