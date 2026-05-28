from django.db import models


class Repuesto(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    stock = models.IntegerField(default=0)

    class Meta:
        db_table = 'repuesto'

    def __str__(self):
        return self.nombre


class IngresoRepuesto(models.Model):
    repuesto = models.ForeignKey(Repuesto, on_delete=models.CASCADE, related_name='ingresos')
    cantidad = models.IntegerField()
    fecha = models.DateField(auto_now_add=True)
    descripcion = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'ingreso_repuesto'

    def __str__(self):
        return f'Ingreso {self.repuesto.nombre} - {self.cantidad}'


class SalidaRepuesto(models.Model):
    repuesto = models.ForeignKey(Repuesto, on_delete=models.CASCADE, related_name='salidas')
    orden = models.ForeignKey('taller.OrdenTrabajo', on_delete=models.SET_NULL, null=True, blank=True, related_name='salidas_repuestos')
    cantidad = models.IntegerField()
    fecha = models.DateField(auto_now_add=True)
    descripcion = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'salida_repuesto'

    def __str__(self):
        return f'Salida {self.repuesto.nombre} - {self.cantidad}'


class Ubicacion(models.Model):
    nombre = models.CharField(max_length=100)
    zona = models.CharField(max_length=50)

    class Meta:
        db_table = 'ubicacion'

    def __str__(self):
        return f'{self.nombre} ({self.zona})'


class Rollo(models.Model):
    ESTADOS = [
        ('activo', 'Activo'),
        ('entregado', 'Entregado'),
        ('inactivo', 'Inactivo'),
    ]

    peso = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='activo')
    ubicacion = models.ForeignKey(Ubicacion, on_delete=models.SET_NULL, null=True, blank=True, related_name='rollos')

    class Meta:
        db_table = 'rollo'

    def __str__(self):
        return f'Rollo #{self.id} ({self.peso} kg)'


class MovimientoRollo(models.Model):
    TIPOS = [
        ('ingreso', 'Ingreso'),
        ('traslado', 'Traslado'),
    ]


    rollo = models.ForeignKey(Rollo, on_delete=models.CASCADE, related_name='movimientos')
    tipo_movimiento = models.CharField(max_length=20, choices=TIPOS)
    cantidad = models.IntegerField(default=1)
    observacion = models.TextField(blank=True, null=True)
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'movimiento_rollo'

    def __str__(self):
        return f'{self.tipo_movimiento} - Rollo #{self.rollo.id}'


class Kardex(models.Model):
    TIPOS = [
        ('ingreso', 'Ingreso'),
        ('salida', 'Salida'),
    ]

    repuesto = models.ForeignKey(Repuesto, on_delete=models.CASCADE, related_name='kardex')
    tipo = models.CharField(max_length=10, choices=TIPOS)
    cantidad = models.IntegerField()
    stock_anterior = models.IntegerField()
    stock_actual = models.IntegerField()
    descripcion = models.TextField(blank=True, null=True)
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'kardex'
        ordering = ['-fecha']

    def __str__(self):
        return f'{self.tipo} - {self.repuesto.nombre}'