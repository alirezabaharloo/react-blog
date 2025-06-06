from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from blog.models import Article, Category
from rest_framework import status
from rest_framework import generics, permissions
from .serializers import *
from rest_framework.views import APIView

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


class AdminUserListView(generics.ListAPIView):
    """
    Returns a list of all users for admin panel
    """
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):
        return User.objects.all().order_by('-date_joined')


class AdminUserDetailView(generics.RetrieveUpdateAPIView):
    """
    Get and update user details
    """
    queryset = User.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminUser]

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminUserDeactivateView(generics.UpdateAPIView):
    """
    Toggle user active status
    """
    queryset = User.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminUser]
    
    def patch(self, request, *args, **kwargs):
        user = self.get_object()
        user.is_active = not user.is_active
        user.save()
        return Response({'status': 'success'})

class AdminCategoryListView(generics.ListCreateAPIView): # Changed from ListAPIView
    """
    Returns a list of all categories for admin panel and allows creation of new categories
    """
    serializer_class = AdminCategorySerializer
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):
        return Category.objects.all().order_by('name')

class AdminCategoryDetailView(generics.RetrieveUpdateAPIView):
    """
    Get and update category details
    """
    queryset = Category.objects.all()
    serializer_class = AdminCategorySerializer
    permission_classes = [IsAdminUser]
    
class AdminArticleListView(generics.ListCreateAPIView):
    """
    Returns a list of all articles for admin panel and allows creation of new articles
    """
    serializer_class = AdminArticleSerializer
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):
        return Article.objects.all().select_related('category', 'author').order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class AdminArticleDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Get, update and delete article details
    """
    queryset = Article.objects.all().select_related('category', 'author')
    serializer_class = AdminArticleSerializer
    permission_classes = [IsAdminUser]
    
    def perform_update(self, serializer):
        serializer.save()
        

class AdminArticlePublishView(APIView):
    """
    API endpoint for publishing articles
    """
    permission_classes = [IsAdminUser]

    def patch(self, request, *args, **kwargs):
        """
        Publish an article
        """
        article = Article.objects.get(id=kwargs['pk'])
        article.status = 'published' if article.status == 'draft' else 'draft'
        article.save()
        return Response({"message": "article status changed successfully!"}, status=status.HTTP_200_OK)
