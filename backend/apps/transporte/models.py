from django.db import models


class Vehiculo(models.Model):
    ESTADOS = [
        ('activo', 'Activo'),
        ('inactivo', 'Inactivo'),
        ('en_mantenimiento', 'En Mantenimiento'),
    ]

    placa = models.CharField(max_length=20, unique=True)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='activo')

    class Meta:
        db_table = 'vehiculo'

    def __str__(self):
        return self.placa


class Conductor(models.Model):
    ESTADOS = [
        ('activo', 'Activo'),
        ('inactivo', 'Inactivo'),
    ]

    nombre = models.CharField(max_length=100)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='activo')

    class Meta:
        db_table = 'conductor'

    def __str__(self):
        return self.nombre


class Ruta(models.Model):
    ESTADOS = [
        ('pendiente', 'Pendiente'),
        ('en_proceso', 'En Proceso'),
        ('finalizada', 'Finalizada'),
        ('cancelada', 'Cancelada'),
    ]

    destino = models.CharField(max_length=100)
    fecha_salida = models.DateField()
    fecha_entrega = models.DateField()
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')
    vehiculo = models.ForeignKey(Vehiculo, on_delete=models.SET_NULL, null=True)
    conductor = models.ForeignKey(Conductor, on_delete=models.SET_NULL, null=True)

    class Meta:
        db_table = 'ruta'

    def __str__(self):
        return f'{self.destino} - {self.estado}'


class Entrega(models.Model):
    ESTADOS = [
        ('pendiente', 'Pendiente'),
        ('entregado', 'Entregado'),
        ('cancelado', 'Cancelado'),
    ]

    ruta = models.ForeignKey(Ruta, on_delete=models.CASCADE, related_name='entregas')
    rollo = models.ForeignKey('bodega.Rollo', on_delete=models.CASCADE, related_name='entregas', null=True, blank=True)
    cantidad = models.IntegerField()
    estado_entrega = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')

    class Meta:
        db_table = 'entrega'

    def __str__(self):
        return f'Entrega ruta #{self.ruta.id}'