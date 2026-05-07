from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Vehiculo, Conductor, Ruta, Entrega
from .serializers import VehiculoSerializer, ConductorSerializer, RutaSerializer, EntregaSerializer


class ListarCrearVehiculosView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        vehiculos = Vehiculo.objects.all().order_by('placa')
        serializer = VehiculoSerializer(vehiculos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = VehiculoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DetalleVehiculoView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            vehiculo = Vehiculo.objects.get(pk=pk)
        except Vehiculo.DoesNotExist:
            return Response({'error': 'Vehículo no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        serializer = VehiculoSerializer(vehiculo, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListarCrearConductoresView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        conductores = Conductor.objects.all().order_by('nombre')
        serializer = ConductorSerializer(conductores, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ConductorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DetalleConductorView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            conductor = Conductor.objects.get(pk=pk)
        except Conductor.DoesNotExist:
            return Response({'error': 'Conductor no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ConductorSerializer(conductor, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListarCrearRutasView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        rutas = Ruta.objects.all().order_by('-fecha_salida')
        serializer = RutaSerializer(rutas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = RutaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DetalleRutaView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            ruta = Ruta.objects.get(pk=pk)
        except Ruta.DoesNotExist:
            return Response({'error': 'Ruta no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        serializer = RutaSerializer(ruta, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListarCrearEntregasView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        entregas = Entrega.objects.all().order_by('-id')
        serializer = EntregaSerializer(entregas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = EntregaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)