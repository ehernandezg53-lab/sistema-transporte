from rest_framework import serializers
from .models import Repuesto, SalidaRepuesto


class RepuestoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Repuesto
        fields = ['id', 'nombre', 'descripcion', 'stock']


class SalidaRepuestoSerializer(serializers.ModelSerializer):
    repuesto_nombre = serializers.CharField(source='repuesto.nombre', read_only=True)
    repuesto_id = serializers.PrimaryKeyRelatedField(
        queryset=Repuesto.objects.all(), source='repuesto'
    )

    class Meta:
        model = SalidaRepuesto
        fields = ['id', 'repuesto_id', 'repuesto_nombre', 'cantidad', 'fecha', 'descripcion']

    def create(self, validated_data):
        repuesto = validated_data['repuesto']
        cantidad = validated_data['cantidad']

        if repuesto.stock < cantidad:
            raise serializers.ValidationError('Stock insuficiente')

        repuesto.stock -= cantidad
        repuesto.save()

        return SalidaRepuesto.objects.create(**validated_data)