from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

   dependencies = [
    ('bodega', '0002_alter_salidarepuesto_repuesto_ingresorepuesto_kardex'),
    ('taller', '0001_initial'),
]

operations = [
        migrations.AddField(
            model_name='salidarepuesto',
            name='orden_trabajo',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='salidas_repuesto',
                to='taller.ordentrabajo'
            ),
        ),
    ]