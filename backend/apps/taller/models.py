from django.db import models


class Mecanico(models.Model):
    ESTADOS = [
        ('activo', 'Activo'),
        ('inactivo', 'Inactivo'),
    ]

    nombre = models.CharField(max_length=100)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    especialidad = models.CharField(max_length=100, blank=True, null=True)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='activo')

    class Meta:
        db_table = 'mecanico'

    def __str__(self):
        return self.nombre


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

    numero_orden = models.CharField(max_length=20, unique=True, blank=True)
    fecha_creacion = models.DateField(auto_now_add=True)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')
    descripcion = models.TextField(blank=True, null=True)
    area = models.CharField(max_length=20, choices=AREAS)
    vehiculo = models.ForeignKey('transporte.Vehiculo', on_delete=models.SET_NULL, null=True, blank=True)
    mecanico = models.ForeignKey(Mecanico, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        db_table = 'orden_trabajo'

    def save(self, *args, **kwargs):
        if not self.pk:
            self.numero_orden = 'OT-TEMP'
            super().save(*args, **kwargs)
            self.numero_orden = f'OT-{str(self.id).zfill(5)}'
            OrdenTrabajo.objects.filter(pk=self.pk).update(numero_orden=self.numero_orden)
        else:
            super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.numero_orden} - {self.estado}'


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
        return f'{self.tipo_mantenimiento} - {self.orden.numero_orden}'