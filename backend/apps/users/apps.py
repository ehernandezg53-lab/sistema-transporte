from django.apps import AppConfig
import sys

class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.users'

    def ready(self):
        if 'makemigrations' not in sys.argv and 'migrate' not in sys.argv:
            try:
                from django.core.management import call_command
                call_command('seed_users')
            except Exception as e:
                print(f"Skipping auto-seed: {e}")