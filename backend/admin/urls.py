from django.urls import path
from . import views

urlpatterns = [
    path('stats/', views.get_stats, name='admin-stats'),
    path('admin-access/', views.check_admin_access, name='admin-access-check'),
] 