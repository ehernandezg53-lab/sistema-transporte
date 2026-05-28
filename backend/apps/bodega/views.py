from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Repuesto, IngresoRepuesto, SalidaRepuesto, Kardex, Ubicacion, Rollo, MovimientoRollo
from .serializers import (
    RepuestoSerializer, IngresoRepuestoSerializer, SalidaRepuestoSerializer, KardexSerializer,
    UbicacionSerializer, RolloSerializer, MovimientoRolloSerializer
)


class ListarCrearRepuestosView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        repuestos = Repuesto.objects.all().order_by('nombre')
        serializer = RepuestoSerializer(repuestos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = RepuestoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DetalleRepuestoView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            repuesto = Repuesto.objects.get(pk=pk)
        except Repuesto.DoesNotExist:
            return Response({'error': 'Repuesto no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        serializer = RepuestoSerializer(repuesto, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListarCrearIngresosView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        ingresos = IngresoRepuesto.objects.all().order_by('-fecha')
        serializer = IngresoRepuestoSerializer(ingresos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = IngresoRepuestoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListarCrearSalidasView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        salidas = SalidaRepuesto.objects.all().order_by('-fecha')
        serializer = SalidaRepuestoSerializer(salidas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = SalidaRepuestoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListarKardexView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        repuesto_id = request.query_params.get('repuesto_id', None)
        if repuesto_id:
            kardex = Kardex.objects.filter(repuesto_id=repuesto_id).order_by('-fecha')
        else:
            kardex = Kardex.objects.all().order_by('-fecha')
        serializer = KardexSerializer(kardex, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# Nuevas Vistas para Ubicación, Rollo y Movimiento de Rollo

class ListarCrearUbicacionesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        ubicaciones = Ubicacion.objects.all().order_by('nombre')
        serializer = UbicacionSerializer(ubicaciones, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = UbicacionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DetalleUbicacionView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            ubicacion = Ubicacion.objects.get(pk=pk)
        except Ubicacion.DoesNotExist:
            return Response({'error': 'Ubicación no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        serializer = UbicacionSerializer(ubicacion, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            ubicacion = Ubicacion.objects.get(pk=pk)
            ubicacion.delete()
            return Response({'mensaje': 'Ubicación eliminada correctamente'}, status=status.HTTP_200_OK)
        except Ubicacion.DoesNotExist:
            return Response({'error': 'Ubicación no encontrada'}, status=status.HTTP_404_NOT_FOUND)


class ListarCrearRollosView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        rollos = Rollo.objects.all().order_by('-id')
        serializer = RolloSerializer(rollos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = RolloSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DetalleRolloView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            rollo = Rollo.objects.get(pk=pk)
        except Rollo.DoesNotExist:
            return Response({'error': 'Rollo no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        serializer = RolloSerializer(rollo, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            rollo = Rollo.objects.get(pk=pk)
            rollo.delete()
            return Response({'mensaje': 'Rollo eliminado correctamente'}, status=status.HTTP_200_OK)
        except Rollo.DoesNotExist:
            return Response({'error': 'Rollo no encontrado'}, status=status.HTTP_404_NOT_FOUND)


class ListarCrearMovimientosRolloView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        movimientos = MovimientoRollo.objects.all().order_by('-fecha')
        serializer = MovimientoRolloSerializer(movimientos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = MovimientoRolloSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)