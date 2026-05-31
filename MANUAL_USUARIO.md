# Manual de Usuario - Sistema de Gestión de Transporte y Logística

## 1. Introducción
El Sistema de Gestión de Transporte es una plataforma integral web diseñada para optimizar los procesos operativos en las áreas de transporte, logística, bodega y taller. Esta herramienta permite tener un control centralizado y detallado sobre la flota de vehículos, conductores, inventario, asignación de rutas y mantenimiento de las unidades.

## 2. Roles de Usuario
El sistema cuenta con un modelo de seguridad basado en roles, donde cada usuario tiene acceso únicamente a los módulos que corresponden a sus funciones:
- **Administrador**: Acceso total al sistema. Puede gestionar usuarios, asignar roles, y ver todos los módulos para auditoría general.
- **Logística de Transporte**: Encargados de la gestión de vehículos, pilotos, y asignación de rutas (viajes).
- **Bodega**: Encargados del control de inventario, repuestos, ingresos, salidas y gestión especializada de rollos de alambre.
- **Taller**: Encargados del mantenimiento de vehículos y control de órdenes de trabajo.

## 3. Acceso al Sistema
Para ingresar al sistema:
1. Abra su navegador web (recomendado Google Chrome o Microsoft Edge).
2. Diríjase a la dirección URL de la aplicación.
3. Ingrese su **Correo Electrónico** y **Contraseña** proporcionados por el Administrador.
4. Haga clic en el botón de **Iniciar Sesión**.
Dependiendo de su rol, el sistema lo redirigirá de manera automática al panel de control que le corresponde.

## 4. Módulos Principales

### 4.1. Módulo de Logística (Transporte)
Este módulo permite la administración de la flota y la logística de viajes.
- **Vehículos**: Permite registrar y visualizar los camiones o unidades (número de placa, marca, modelo, año, y estado operativo).
- **Pilotos**: Gestión de conductores, incluyendo la validación de sus licencias, vencimientos e información de contacto.
- **Rutas y Viajes**: Asignación de pilotos y vehículos a rutas específicas. Permite llevar el control del estado de un viaje (ej. pendiente, en ruta, completado).

### 4.2. Módulo de Bodega
Encargado del control estricto del stock e inventario de repuestos, así como de insumos específicos como rollos de alambre.
- **Ingresos**: Registro de entrada de nuevos repuestos al inventario. Aumenta el stock disponible.
- **Salidas**: Registro de repuestos entregados o utilizados. Cada salida debe asociarse idealmente a una Orden de Trabajo del Taller para justificar el gasto.
- **Kardex**: Historial completo de movimientos (todas las entradas y salidas) de un repuesto en particular. Muy útil para auditorías.
- **Inventario**: Vista general de todos los repuestos registrados y sus existencias actuales.
- **Ubicaciones**: Permite organizar la bodega por estantes o zonas.
- **Rollos**: Registro y control del estado de los rollos de alambre (peso, estado, ubicación). *Nota: Toda la gestión y visualización de los rollos se realiza ahora de manera consolidada en este apartado.*

### 4.3. Módulo de Taller
Diseñado para la gestión del mantenimiento correctivo y preventivo de la flota.
- **Órdenes de Trabajo**: Creación de tickets de reparación o mantenimiento para un vehículo específico.
  - Se puede detallar el diagnóstico, el mecánico asignado y actualizar el estado de la reparación (pendiente, en proceso, terminado).
  - Como se mencionó en Bodega, los repuestos necesarios para completar una orden se deben registrar en el sistema como una "Salida de Bodega" asociada a esta Orden.

## 5. Preguntas Frecuentes

**¿Qué hago si olvidé mi contraseña o mi usuario está bloqueado?**
Contacte con el Administrador del sistema para realizar un reseteo seguro de sus credenciales.

**¿Cómo asigno un repuesto a un vehículo en reparación?**
1. Primero, el personal de Taller debe crear una **Orden de Trabajo** para el vehículo.
2. Luego, el personal de Bodega (o quien tenga los permisos), va al módulo de Bodega, pestaña **Salidas**.
3. Registra el repuesto que se está entregando y en el formulario selecciona el número de la **Orden de Trabajo** correspondiente.

**¿Qué pasa si mi sesión caduca?**
Por seguridad, el sistema cierra la sesión automáticamente tras un periodo de inactividad prolongado. Solo necesita volver a ingresar sus credenciales en la pantalla de inicio de sesión.

## 6. Soporte Técnico
Para reportar fallas técnicas, solicitar capacitación adicional o sugerir mejoras en la plataforma, por favor comuníquese con el departamento de IT o el proveedor encargado del sistema.
