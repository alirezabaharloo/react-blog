from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, UserProfileView, ChangePasswordView
from .custom.views import CustomTokenObtainPairView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('get-access-token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('get-refresh-token/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
] 