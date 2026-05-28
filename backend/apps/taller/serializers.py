from rest_framework import serializers
from .models import OrdenTrabajo, Mantenimiento, Mecanico
from apps.transporte.models import Vehiculo
from apps.bodega.models import SalidaRepuesto


class MecanicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mecanico
        fields = ['id', 'nombre', 'telefono', 'especialidad', 'estado']


class SalidaRepuestoOrdenSerializer(serializers.ModelSerializer):
    repuesto_nombre = serializers.CharField(source='repuesto.nombre', read_only=True)

    class Meta:
        model = SalidaRepuesto
        fields = ['id', 'repuesto_nombre', 'cantidad', 'fecha']


class MantenimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mantenimiento
        fields = ['id', 'orden', 'tipo_mantenimiento', 'fecha', 'lugar']


class OrdenTrabajoSerializer(serializers.ModelSerializer):
    salidas_repuestos = SalidaRepuestoOrdenSerializer(many=True, read_only=True)
    vehiculo_placa = serializers.CharField(source='vehiculo.placa', read_only=True)
    mecanico_nombre = serializers.CharField(source='mecanico.nombre', read_only=True)
    vehiculo_id = serializers.PrimaryKeyRelatedField(
        queryset=Vehiculo.objects.all(), source='vehiculo',
        write_only=False, required=False, allow_null=True
    )
    mecanico_id = serializers.PrimaryKeyRelatedField(
        queryset=Mecanico.objects.all(), source='mecanico',
        write_only=False, required=False, allow_null=True
    )

    class Meta:
        model = OrdenTrabajo
        fields = [
            'id', 'numero_orden', 'fecha_creacion', 'estado', 'descripcion', 'area',
            'vehiculo_id', 'vehiculo_placa', 'mecanico_id', 'mecanico_nombre',
            'salidas_repuestos'
        ]
        read_only_fields = ['numero_orden']