from django.db.models import Q
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser

from .models import Category, Article
from .serializers import CategorySerializer, ArticleSerializer, ArticleListSerializer
from rest_framework.views import APIView

class CategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint for retrieving categories
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        """
        Allow read-only access to anyone, but require admin permissions for write operations
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = []
        return [permission() for permission in permission_classes]


class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for retrieving articles
    """
    queryset = Article.objects.filter(status='published').select_related('category')
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ArticleListSerializer
        return ArticleSerializer
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """
        Search articles endpoint - matches the Node.js /articles/search endpoint
        """
        search_term = request.query_params.get('q', '').lower()
        
        if not search_term:
            return Response(
                {"error": "Search term is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Search in title, excerpt and content
        search_results = Article.objects.filter(
            Q(title__icontains=search_term) | 
            Q(excerpt__icontains=search_term) | 
            Q(content__icontains=search_term)
        ).select_related('category')
        
        if search_results.count() == 0:
            return Response(
                {"error": "No articles found!"}, 
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ArticleListSerializer(search_results, many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, *args, **kwargs):
        """
        Get a single article with related articles
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        # Find related articles in the same category
        related_articles = Article.objects.filter(
            category=instance.category
        ).exclude(
            id=instance.id
        ).select_related(
            'category'
        )[:3]  # Limit to 3 related articles
        
        related_serializer = ArticleListSerializer(related_articles, many=True)
        
        # Format response to match existing API
        return Response({
            'article': serializer.data,
            'relatedArticles': related_serializer.data
        })


