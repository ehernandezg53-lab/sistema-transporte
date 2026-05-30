from django.core.management.base import BaseCommand
from apps.users.models import Rol, Usuario


class Command(BaseCommand):
    help = 'Crea roles y usuarios iniciales para el sistema de transporte'

    def handle(self, *args, **options):
        # ── Crear Roles ──
        roles_nombres = ['Administrador', 'Bodega', 'Taller', 'Logística de Transporte']
        roles = {}
        for nombre in roles_nombres:
            rol, created = Rol.objects.get_or_create(nombre_rol=nombre)
            roles[nombre] = rol
            if created:
                self.stdout.write(self.style.SUCCESS(f'  [OK] Rol creado: {nombre}'))
            else:
                self.stdout.write(f'  [INFO] Rol ya existe: {nombre}')

        # ── Crear Usuarios ──
        usuarios_data = [
            {
                'correo': 'admin@transporte.gt',
                'nombre': 'Carlos Administrador',
                'password': 'Admin2025!',
                'rol': 'Administrador',
                'is_staff': True,
                'is_superuser': True,
            },
            {
                'correo': 'bodega@transporte.gt',
                'nombre': 'María Bodega',
                'password': 'Bodega2025!',
                'rol': 'Bodega',
            },
            {
                'correo': 'taller@transporte.gt',
                'nombre': 'Juan Taller',
                'password': 'Taller2025!',
                'rol': 'Taller',
            },
            {
                'correo': 'logistica@transporte.gt',
                'nombre': 'Ana Logística',
                'password': 'Logistica2025!',
                'rol': 'Logística de Transporte',
            },
        ]

        for data in usuarios_data:
            if not Usuario.objects.filter(correo=data['correo']).exists():
                user = Usuario.objects.create_user(
                    correo=data['correo'],
                    nombre=data['nombre'],
                    password=data['password'],
                    rol=roles[data['rol']],
                    is_staff=data.get('is_staff', False),
                    is_superuser=data.get('is_superuser', False),
                )
                self.stdout.write(self.style.SUCCESS(
                    f'  [OK] Usuario creado: {data["correo"]} (Rol: {data["rol"]})'
                ))
            else:
                self.stdout.write(f'  [INFO] Usuario ya existe: {data["correo"]}')

        self.stdout.write(self.style.SUCCESS('\n[SUCCESS] Seed completado exitosamente.'))
