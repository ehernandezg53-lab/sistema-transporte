from rest_framework import serializers
from .models import OrdenTrabajo, Mantenimiento, SalidaRepuestoTaller
from apps.bodega.models import Repuesto
from apps.transporte.models import Vehiculo, Conductor


class SalidaRepuestoTallerSerializer(serializers.ModelSerializer):
    repuesto_nombre = serializers.CharField(source='repuesto.nombre', read_only=True)
    repuesto_id = serializers.PrimaryKeyRelatedField(
        queryset=Repuesto.objects.all(), source='repuesto'
    )

    class Meta:
        model = SalidaRepuestoTaller
        fields = ['id', 'repuesto_id', 'repuesto_nombre', 'cantidad', 'fecha']

    def create(self, validated_data):
        repuesto = validated_data['repuesto']
        cantidad = validated_data['cantidad']

        if repuesto.stock < cantidad:
            raise serializers.ValidationError('Stock insuficiente')

        repuesto.stock -= cantidad
        repuesto.save()

        return SalidaRepuestoTaller.objects.create(**validated_data)


class MantenimientoSerializer(serializers.ModelSerializer):
    repuestos_usados = SalidaRepuestoTallerSerializer(many=True, read_only=True)

    class Meta:
        model = Mantenimiento
        fields = ['id', 'orden', 'tipo_mantenimiento', 'fecha', 'lugar', 'repuestos_usados']


class OrdenTrabajoSerializer(serializers.ModelSerializer):
    mantenimientos = MantenimientoSerializer(many=True, read_only=True)
    vehiculo_placa = serializers.CharField(source='vehiculo.placa', read_only=True)
    mecanico_nombre = serializers.CharField(source='mecanico.nombre', read_only=True)
    vehiculo_id = serializers.PrimaryKeyRelatedField(
        queryset=Vehiculo.objects.all(), source='vehiculo', write_only=True, required=False, allow_null=True
    )
    mecanico_id = serializers.PrimaryKeyRelatedField(
        queryset=Conductor.objects.all(), source='mecanico', write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = OrdenTrabajo
        fields = [
            'id', 'fecha_creacion', 'estado', 'descripcion', 'area',
            'vehiculo_id', 'vehiculo_placa', 'mecanico_id', 'mecanico_nombre',
            'mantenimientos'
        ]