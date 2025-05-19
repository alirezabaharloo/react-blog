from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from blog.models import Article, Category
from rest_framework import status

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_admin_access(request):
    """
    Check if the authenticated user has admin access
    """
    is_admin = request.user.is_superuser
    if not is_admin:
        return Response('Access denied.', status=status.HTTP_403_FORBIDDEN)
    return Response("Access granted.", status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_stats(request):
    """
    Get statistics for the admin dashboard
    """
    stats = {
        'normalUsers': User.objects.filter(is_staff=False).count(),
        'adminUsers': User.objects.filter(is_staff=True).count(),
        'articles': Article.objects.count(),
        'categories': Category.objects.count()
    }
    
    return Response(stats) 