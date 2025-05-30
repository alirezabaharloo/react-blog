from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/blog/', include('blog.urls')),
    path('api/admin/', include('admin.urls')),
]
