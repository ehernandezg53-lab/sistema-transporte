from django.urls import path
from .views import (
    LoginView,
    ListarUsuariosView,
    CrearUsuarioView,
    DetalleUsuarioView,
    EditarUsuarioView,
    ToggleEstadoUsuarioView,
    ListarRolesView,
)

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('', ListarUsuariosView.as_view(), name='listar-usuarios'),
    path('crear/', CrearUsuarioView.as_view(), name='crear-usuario'),
    path('<int:pk>/', DetalleUsuarioView.as_view(), name='detalle-usuario'),
    path('<int:pk>/editar/', EditarUsuarioView.as_view(), name='editar-usuario'),
    path('<int:pk>/toggle/', ToggleEstadoUsuarioView.as_view(), name='toggle-usuario'),
    path('roles/', ListarRolesView.as_view(), name='listar-roles'),
]