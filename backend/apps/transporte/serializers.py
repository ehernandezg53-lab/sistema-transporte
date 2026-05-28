from rest_framework import serializers
from .models import Vehiculo, Conductor, Ruta, Entrega
from apps.bodega.models import Rollo


class VehiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehiculo
        fields = ['id', 'placa', 'estado']


class ConductorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conductor
        fields = ['id', 'nombre', 'telefono', 'estado']


class EntregaSerializer(serializers.ModelSerializer):
    rollo_id = serializers.PrimaryKeyRelatedField(
        queryset=Rollo.objects.all(), source='rollo'
    )
    rollo_peso = serializers.DecimalField(source='rollo.peso', max_digits=10, decimal_places=2, read_only=True)
    ruta_destino = serializers.CharField(source='ruta.destino', read_only=True)

    class Meta:
        model = Entrega
        fields = ['id', 'ruta', 'ruta_destino', 'rollo_id', 'rollo_peso', 'cantidad', 'estado_entrega']

    def create(self, validated_data):
        rollo = validated_data['rollo']
        rollo.estado = 'entregado'
        rollo.save()
        return Entrega.objects.create(**validated_data)


class RutaSerializer(serializers.ModelSerializer):
    vehiculo_placa = serializers.CharField(source='vehiculo.placa', read_only=True)
    conductor_nombre = serializers.CharField(source='conductor.nombre', read_only=True)
    vehiculo_id = serializers.PrimaryKeyRelatedField(
        queryset=Vehiculo.objects.all(), source='vehiculo', write_only=True, required=False, allow_null=True
    )
    conductor_id = serializers.PrimaryKeyRelatedField(
        queryset=Conductor.objects.all(), source='conductor', write_only=True, required=False, allow_null=True
    )
    
    # Campo de escritura de Rollo
    rollo_id = serializers.PrimaryKeyRelatedField(
        queryset=Rollo.objects.all(), required=False, write_only=True, allow_null=True
    )
    # Información leíble del Rollo para el listado de rutas
    rollo_info = serializers.SerializerMethodField(read_only=True)
    entregas = EntregaSerializer(many=True, read_only=True)

    class Meta:
        model = Ruta
        fields = [
            'id', 'destino', 'fecha_salida', 'fecha_entrega',
            'estado', 'vehiculo_id', 'vehiculo_placa',
            'conductor_id', 'conductor_nombre', 'rollo_id', 'rollo_info', 'entregas'
        ]

    def get_rollo_info(self, obj):
        entrega = obj.entregas.first()
        if entrega and entrega.rollo:
            return {
                'id': entrega.rollo.id,
                'peso': str(entrega.rollo.peso),
                'estado': entrega.rollo.estado
            }
        return None

    def create(self, validated_data):
        rollo = validated_data.pop('rollo_id', None)
        ruta = super().create(validated_data)
        if rollo:
            # Automáticamente creamos la entrega y sacamos el rollo de bodega (estado = entregado)
            Entrega.objects.create(ruta=ruta, rollo=rollo, cantidad=1, estado_entrega='entregado')
            rollo.estado = 'entregado'
            rollo.save()
        return ruta

    def update(self, instance, validated_data):
        has_rollo_key = 'rollo_id' in validated_data
        rollo = validated_data.pop('rollo_id', None)
        ruta = super().update(instance, validated_data)
        if rollo:
            entrega = ruta.entregas.first()
            if entrega:
                old_rollo = entrega.rollo
                if old_rollo and old_rollo != rollo:
                    old_rollo.estado = 'activo'
                    old_rollo.save()
                entrega.rollo = rollo
                entrega.estado_entrega = 'entregado'
                entrega.save()
            else:
                Entrega.objects.create(ruta=ruta, rollo=rollo, cantidad=1, estado_entrega='entregado')
            
            rollo.estado = 'entregado'
            rollo.save()
        elif has_rollo_key and rollo is None:
            # Si remueven el rollo o se envía explícitamente nulo
            entrega = ruta.entregas.first()
            if entrega:
                old_rollo = entrega.rollo
                if old_rollo:
                    old_rollo.estado = 'activo'
                    old_rollo.save()
                entrega.delete()
        return ruta