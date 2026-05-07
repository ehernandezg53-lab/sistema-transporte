from django.db import models


class OrdenTrabajo(models.Model):
    ESTADOS = [
        ('pendiente', 'Pendiente'),
        ('en_proceso', 'En Proceso'),
        ('finalizada', 'Finalizada'),
        ('cancelada', 'Cancelada'),
    ]

    AREAS = [
        ('electrico', 'Eléctrico'),
        ('tapiceria', 'Tapicería'),
        ('llantas', 'Llantas'),
        ('soldadura', 'Soldadura'),
        ('mecanica_general', 'Mecánica General'),
    ]

    fecha_creacion = models.DateField(auto_now_add=True)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')
    descripcion = models.TextField(blank=True, null=True)
    area = models.CharField(max_length=20, choices=AREAS)
    vehiculo = models.ForeignKey('transporte.Vehiculo', on_delete=models.SET_NULL, null=True)
    mecanico = models.ForeignKey('transporte.Conductor', on_delete=models.SET_NULL, null=True)

    class Meta:
        db_table = 'orden_trabajo'

    def __str__(self):
        return f'Orden #{self.id} - {self.estado}'


class Mantenimiento(models.Model):
    TIPOS = [
        ('preventivo', 'Preventivo'),
        ('correctivo', 'Correctivo'),
    ]

    orden = models.ForeignKey(OrdenTrabajo, on_delete=models.CASCADE, related_name='mantenimientos')
    tipo_mantenimiento = models.CharField(max_length=20, choices=TIPOS)
    fecha = models.DateField()
    lugar = models.CharField(max_length=100)

    class Meta:
        db_table = 'mantenimiento'

    def __str__(self):
        return f'{self.tipo_mantenimiento} - Orden #{self.orden.id}'


class SalidaRepuestoTaller(models.Model):
    mantenimiento = models.ForeignKey(Mantenimiento, on_delete=models.CASCADE, related_name='repuestos_usados')
    repuesto = models.ForeignKey('bodega.Repuesto', on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    fecha = models.DateField(auto_now_add=True)

    class Meta:
        db_table = 'salida_repuesto_taller'

    def __str__(self):
        return f'{self.repuesto.nombre} - {self.cantidad}'