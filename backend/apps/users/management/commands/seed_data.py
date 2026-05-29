from django.core.management.base import BaseCommand
from apps.users.models import Rol, Usuario


class Command(BaseCommand):
    help = 'Crea los roles y usuarios iniciales del sistema'

    def handle(self, *args, **options):
        # ── Crear Roles ──
        roles_nombres = ['Administrador', 'Bodega', 'Taller', 'Logística de Transporte']
        roles = {}
        for nombre in roles_nombres:
            rol, created = Rol.objects.get_or_create(nombre_rol=nombre)
            roles[nombre] = rol
            if created:
                self.stdout.write(self.style.SUCCESS(f'  ✅ Rol creado: {nombre}'))
            else:
                self.stdout.write(f'  ℹ️  Rol ya existe: {nombre}')

        # ── Crear Usuarios ──
        usuarios_data = [
            {
                'correo': 'admin@transporte.gt',
                'nombre': 'Carlos Administrador',
                'password': 'Admin2026!',
                'rol': 'Administrador',
                'is_staff': True,
                'is_superuser': True,
            },
            {
                'correo': 'bodega@transporte.gt',
                'nombre': 'María Bodega',
                'password': 'Bodega2026!',
                'rol': 'Bodega',
            },
            {
                'correo': 'taller@transporte.gt',
                'nombre': 'José Taller',
                'password': 'Taller2026!',
                'rol': 'Taller',
            },
            {
                'correo': 'logistica@transporte.gt',
                'nombre': 'Ana Logística',
                'password': 'Logistica2026!',
                'rol': 'Logística de Transporte',
            },
        ]

        for data in usuarios_data:
            correo = data['correo']
            if Usuario.objects.filter(correo=correo).exists():
                self.stdout.write(f'  ℹ️  Usuario ya existe: {correo}')
                continue

            usuario = Usuario.objects.create_user(
                correo=correo,
                nombre=data['nombre'],
                password=data['password'],
                rol=roles[data['rol']],
                is_staff=data.get('is_staff', False),
                is_superuser=data.get('is_superuser', False),
            )
            self.stdout.write(self.style.SUCCESS(
                f'  ✅ Usuario creado: {correo} | Rol: {data["rol"]} | Password: {data["password"]}'
            ))

        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS('🎉 Datos iniciales cargados correctamente.'))
