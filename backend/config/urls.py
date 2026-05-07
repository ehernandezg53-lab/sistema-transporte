from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('apps.users.urls')),
    path('api/bodega/', include('apps.bodega.urls')),
    path('api/taller/', include('apps.taller.urls')),
    path('api/transporte/', include('apps.transporte.urls')),
]