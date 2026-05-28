from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import OrdenTrabajo, Mantenimiento, Mecanico
from .serializers import OrdenTrabajoSerializer, MantenimientoSerializer, MecanicoSerializer


class ListarCrearMecanicosView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        mecanicos = Mecanico.objects.all().order_by('nombre')
        serializer = MecanicoSerializer(mecanicos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = MecanicoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DetalleMecanicoView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            mecanico = Mecanico.objects.get(pk=pk)
        except Mecanico.DoesNotExist:
            return Response({'error': 'Mecánico no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        serializer = MecanicoSerializer(mecanico, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListarCrearOrdenesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        ordenes = OrdenTrabajo.objects.all().order_by('-fecha_creacion')
        serializer = OrdenTrabajoSerializer(ordenes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = OrdenTrabajoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DetalleOrdenView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            orden = OrdenTrabajo.objects.get(pk=pk)
        except OrdenTrabajo.DoesNotExist:
            return Response({'error': 'Orden no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        serializer = OrdenTrabajoSerializer(orden)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        try:
            orden = OrdenTrabajo.objects.get(pk=pk)
        except OrdenTrabajo.DoesNotExist:
            return Response({'error': 'Orden no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        serializer = OrdenTrabajoSerializer(orden, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BuscarOrdenView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        numero_orden = request.query_params.get('numero_orden', None)
        if not numero_orden:
            return Response({'error': 'Debe proporcionar un número de orden'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            orden = OrdenTrabajo.objects.get(numero_orden=numero_orden)
        except OrdenTrabajo.DoesNotExist:
            return Response({'error': 'Orden no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        serializer = OrdenTrabajoSerializer(orden)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ListarCrearMantenimientosView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        mantenimientos = Mantenimiento.objects.all().order_by('-fecha')
        serializer = MantenimientoSerializer(mantenimientos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = MantenimientoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)