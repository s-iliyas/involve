from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from .models import User
from .serializers import UserSerializer


class UserAPIView(APIView):
    def get(self, request, id):
        try:
            user = User.objects.filter(id=id).first()
            return Response((UserSerializer(user)).data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(e.args[0], status=status.HTTP_400_BAD_REQUEST)
