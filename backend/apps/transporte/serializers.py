from rest_framework import serializers
from .models import Vehiculo, Conductor, Ruta, Entrega


class VehiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehiculo
        fields = ['id', 'placa', 'estado']


class ConductorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conductor
        fields = ['id', 'nombre', 'telefono', 'estado']


class EntregaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entrega
        fields = ['id', 'ruta', 'cantidad', 'estado_entrega']


class RutaSerializer(serializers.ModelSerializer):
    vehiculo_placa = serializers.CharField(source='vehiculo.placa', read_only=True)
    conductor_nombre = serializers.CharField(source='conductor.nombre', read_only=True)
    vehiculo_id = serializers.PrimaryKeyRelatedField(
        queryset=Vehiculo.objects.all(), source='vehiculo', write_only=True
    )
    conductor_id = serializers.PrimaryKeyRelatedField(
        queryset=Conductor.objects.all(), source='conductor', write_only=True
    )
    entregas = EntregaSerializer(many=True, read_only=True)

    class Meta:
        model = Ruta
        fields = [
            'id', 'destino', 'fecha_salida', 'fecha_entrega',
            'estado', 'vehiculo_id', 'vehiculo_placa',
            'conductor_id', 'conductor_nombre', 'entregas'
        ]