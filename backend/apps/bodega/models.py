from django.db import models


class Repuesto(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    stock = models.IntegerField(default=0)

    class Meta:
        db_table = 'repuesto'

    def __str__(self):
        return self.nombre


class SalidaRepuesto(models.Model):
    repuesto = models.ForeignKey(Repuesto, on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    fecha = models.DateField(auto_now_add=True)
    descripcion = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'salida_repuesto'

    def __str__(self):
        return f'{self.repuesto.nombre} - {self.cantidad}'