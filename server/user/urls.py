from django.urls import path
from .views import UserAPIView

urlpatterns = [path("<int:id>/", UserAPIView.as_view(), name="user")]
