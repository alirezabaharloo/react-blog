from django.urls import path
from . import views

urlpatterns = [
    path('stats/', views.get_stats, name='admin-stats'),
    path('admin-access/', views.check_admin_access, name='admin-access-check'),
    path('users/', views.AdminUserListView.as_view(), name='admin-user-list'),
    path('users/<int:pk>/', views.AdminUserDetailView.as_view(), name='admin-user-detail'),
    path('users/<int:pk>/deactivate/', views.AdminUserDeactivateView.as_view(), name='admin-user-deactivate'),
    path('categories/', views.AdminCategoryListView.as_view(), name='admin-category-list'),
    path('categories/<int:pk>/', views.AdminCategoryDetailView.as_view(), name='admin-category-detail'),
    path('articles/', views.AdminArticleListView.as_view(), name='admin-article-list'),
    path('articles/<int:pk>/', views.AdminArticleDetailView.as_view(), name='admin-article-detail'),
    path('articles/<int:pk>/publish/', views.AdminArticlePublishView.as_view(), name='admin-article-publish'),
] 