from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Sum

from apps.bodega.models import Repuesto, Rollo, MovimientoRollo, Ubicacion, SalidaRepuesto
from apps.taller.models import OrdenTrabajo, Mecanico, Mantenimiento
from apps.transporte.models import Vehiculo, Conductor, Ruta, Entrega
from apps.users.models import Usuario


class DashboardReportsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # 1. Bodega Stats
        total_repuestos = Repuesto.objects.count()
        repuestos_bajo_stock = Repuesto.objects.filter(stock__lt=5).values('id', 'nombre', 'stock')
        total_rollos = Rollo.objects.count()
        
        # Rollos por estado
        rollos_por_estado_raw = Rollo.objects.values('estado').annotate(count=Count('id'))
        rollos_por_estado = {item['estado']: item['count'] for item in rollos_por_estado_raw}
        for estado in ['activo', 'entregado', 'inactivo']:
            if estado not in rollos_por_estado:
                rollos_por_estado[estado] = 0

        # Ubicaciones
        total_ubicaciones = Ubicacion.objects.count()
        
        # 2. Taller Stats
        total_ordenes = OrdenTrabajo.objects.count()
        ordenes_por_estado_raw = OrdenTrabajo.objects.values('estado').annotate(count=Count('id'))
        ordenes_por_estado = {item['estado']: item['count'] for item in ordenes_por_estado_raw}
        for estado in ['pendiente', 'en_proceso', 'finalizada', 'cancelada']:
            if estado not in ordenes_por_estado:
                ordenes_por_estado[estado] = 0

        ordenes_por_area_raw = OrdenTrabajo.objects.values('area').annotate(count=Count('id'))
        ordenes_por_area = {item['area']: item['count'] for item in ordenes_por_area_raw}
        
        total_mecanicos = Mecanico.objects.count()
        total_mantenimientos = Mantenimiento.objects.count()
        mantenimientos_por_tipo_raw = Mantenimiento.objects.values('tipo_mantenimiento').annotate(count=Count('id'))
        mantenimientos_por_tipo = {item['tipo_mantenimiento']: item['count'] for item in mantenimientos_por_tipo_raw}

        # 3. Transporte Stats
        total_vehiculos = Vehiculo.objects.count()
        vehiculos_por_estado_raw = Vehiculo.objects.values('estado').annotate(count=Count('id'))
        vehiculos_por_estado = {item['estado']: item['count'] for item in vehiculos_por_estado_raw}
        for estado in ['activo', 'inactivo', 'en_mantenimiento']:
            if estado not in vehiculos_por_estado:
                vehiculos_por_estado[estado] = 0

        total_conductores = Conductor.objects.count()
        total_rutas = Ruta.objects.count()
        
        rutas_por_estado_raw = Ruta.objects.values('estado').annotate(count=Count('id'))
        rutas_por_estado = {item['estado']: item['count'] for item in rutas_por_estado_raw}
        for estado in ['pendiente', 'en_proceso', 'finalizada', 'cancelada']:
            if estado not in rutas_por_estado:
                rutas_por_estado[estado] = 0

        total_entregas = Entrega.objects.count()
        entregas_por_estado_raw = Entrega.objects.values('estado_entrega').annotate(count=Count('id'))
        entregas_por_estado = {item['estado_entrega']: item['count'] for item in entregas_por_estado_raw}
        for estado in ['pendiente', 'entregado', 'cancelado']:
            if estado not in entregas_por_estado:
                entregas_por_estado[estado] = 0

        # 4. Usuarios Stats
        total_usuarios = Usuario.objects.count()
        usuarios_por_rol_raw = Usuario.objects.values('rol__nombre_rol').annotate(count=Count('id'))
        usuarios_por_rol = {item['rol__nombre_rol'] or 'Sin Rol': item['count'] for item in usuarios_por_rol_raw}

        data = {
            'bodega': {
                'total_repuestos': total_repuestos,
                'repuestos_bajo_stock': list(repuestos_bajo_stock),
                'total_rollos': total_rollos,
                'rollos_por_estado': rollos_por_estado,
                'total_ubicaciones': total_ubicaciones,
            },
            'taller': {
                'total_ordenes': total_ordenes,
                'ordenes_por_estado': ordenes_por_estado,
                'ordenes_por_area': ordenes_por_area,
                'total_mecanicos': total_mecanicos,
                'total_mantenimientos': total_mantenimientos,
                'mantenimientos_por_tipo': mantenimientos_por_tipo,
            },
            'transporte': {
                'total_vehiculos': total_vehiculos,
                'vehiculos_por_estado': vehiculos_por_estado,
                'total_conductores': total_conductores,
                'total_rutas': total_rutas,
                'rutas_por_estado': rutas_por_estado,
                'total_entregas': total_entregas,
                'entregas_por_estado': entregas_por_estado,
            },
            'usuarios': {
                'total_usuarios': total_usuarios,
                'usuarios_por_rol': usuarios_por_rol,
            }
        }

        return Response(data, status=status.HTTP_200_OK)
