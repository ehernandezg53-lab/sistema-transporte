from rest_framework import serializers
from .models import Repuesto, IngresoRepuesto, SalidaRepuesto, Kardex, Ubicacion, Rollo, MovimientoRollo
from apps.taller.models import OrdenTrabajo


class RepuestoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Repuesto
        fields = ['id', 'nombre', 'descripcion', 'stock']


class IngresoRepuestoSerializer(serializers.ModelSerializer):
    repuesto_nombre = serializers.CharField(source='repuesto.nombre', read_only=True)
    repuesto_id = serializers.PrimaryKeyRelatedField(
        queryset=Repuesto.objects.all(), source='repuesto'
    )

    class Meta:
        model = IngresoRepuesto
        fields = ['id', 'repuesto_id', 'repuesto_nombre', 'cantidad', 'fecha', 'descripcion']

    def create(self, validated_data):
        repuesto = validated_data['repuesto']
        cantidad = validated_data['cantidad']
        stock_anterior = repuesto.stock

        repuesto.stock += cantidad
        repuesto.save()

        Kardex.objects.create(
            repuesto=repuesto,
            tipo='ingreso',
            cantidad=cantidad,
            stock_anterior=stock_anterior,
            stock_actual=repuesto.stock,
            descripcion=validated_data.get('descripcion', 'Ingreso de repuesto')
        )

        return IngresoRepuesto.objects.create(**validated_data)


class SalidaRepuestoSerializer(serializers.ModelSerializer):
    repuesto_nombre = serializers.CharField(source='repuesto.nombre', read_only=True)
    repuesto_id = serializers.PrimaryKeyRelatedField(
        queryset=Repuesto.objects.all(), source='repuesto'
    )
    orden_id = serializers.PrimaryKeyRelatedField(
        queryset=OrdenTrabajo.objects.all(), source='orden', required=True, allow_null=False
    )
    orden_numero = serializers.CharField(source='orden.numero_orden', read_only=True)

    class Meta:
        model = SalidaRepuesto
        fields = ['id', 'repuesto_id', 'repuesto_nombre', 'orden_id', 'orden_numero', 'cantidad', 'fecha', 'descripcion']

    def validate_orden(self, value):
        if value.estado != 'en_proceso':
            raise serializers.ValidationError('La orden de trabajo seleccionada debe estar en estado "en proceso".')
        return value


    def create(self, validated_data):
        repuesto = validated_data['repuesto']
        cantidad = validated_data['cantidad']

        if repuesto.stock < cantidad:
            raise serializers.ValidationError('Stock insuficiente')

        stock_anterior = repuesto.stock
        repuesto.stock -= cantidad
        repuesto.save()

        Kardex.objects.create(
            repuesto=repuesto,
            tipo='salida',
            cantidad=cantidad,
            stock_anterior=stock_anterior,
            stock_actual=repuesto.stock,
            descripcion=validated_data.get('descripcion', 'Salida para taller')
        )

        return SalidaRepuesto.objects.create(**validated_data)


class KardexSerializer(serializers.ModelSerializer):
    repuesto_nombre = serializers.CharField(source='repuesto.nombre', read_only=True)

    class Meta:
        model = Kardex
        fields = ['id', 'repuesto_nombre', 'tipo', 'cantidad', 'stock_anterior', 'stock_actual', 'descripcion', 'fecha']


class UbicacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ubicacion
        fields = ['id', 'nombre', 'zona']


class RolloSerializer(serializers.ModelSerializer):
    ubicacion_nombre = serializers.CharField(source='ubicacion.nombre', read_only=True)
    ubicacion_zona = serializers.CharField(source='ubicacion.zona', read_only=True)
    ubicacion_id = serializers.PrimaryKeyRelatedField(
        queryset=Ubicacion.objects.all(), source='ubicacion', required=False, allow_null=True
    )

    class Meta:
        model = Rollo
        fields = ['id', 'peso', 'estado', 'ubicacion_id', 'ubicacion_nombre', 'ubicacion_zona']


class MovimientoRolloSerializer(serializers.ModelSerializer):
    rollo_id = serializers.PrimaryKeyRelatedField(
        queryset=Rollo.objects.all(), source='rollo'
    )
    rollo_peso = serializers.DecimalField(source='rollo.peso', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = MovimientoRollo
        fields = ['id', 'rollo_id', 'rollo_peso', 'tipo_movimiento', 'cantidad', 'observacion', 'fecha']

    def create(self, validated_data):
        rollo = validated_data['rollo']
        tipo = validated_data['tipo_movimiento']

        # Actualizar estado del rollo
        if tipo == 'ingreso':
            rollo.estado = 'activo'
            rollo.save()

        return MovimientoRollo.objects.create(**validated_data)