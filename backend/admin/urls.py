from django.urls import path
from . import views

urlpatterns = [
    path('stats/', views.get_stats, name='admin-stats'),
    path('admin-access/', views.check_admin_access, name='admin-access-check'),
    path('users/', views.AdminUserListView.as_view(), name='admin-user-list'),
    path('users/<int:pk>/', views.AdminUserDetailView.as_view(), name='admin-user-detail'),
    path('users/<int:pk>/deactivate/', views.AdminUserDeactivateView.as_view(), name='admin-user-deactivate'),
] 