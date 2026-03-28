from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Repuesto, SalidaRepuesto
from .serializers import RepuestoSerializer, SalidaRepuestoSerializer


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

    def get(self, request, pk):
        try:
            repuesto = Repuesto.objects.get(pk=pk)
        except Repuesto.DoesNotExist:
            return Response({'error': 'Repuesto no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        serializer = RepuestoSerializer(repuesto)
        return Response(serializer.data, status=status.HTTP_200_OK)

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