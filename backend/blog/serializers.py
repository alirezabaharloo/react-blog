from rest_framework import serializers
from .models import Category, Article


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


    def validate_name(self, value):
        
        if Category.objects.filter(name=value).exists():
            raise serializers.ValidationError("category with this title already exists!")

        return value

class ArticleSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    author = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = ['id', 'title', 'excerpt', 'author', 'date', 'read_time', 'image', 'category']

    def get_author(self, obj):
        if obj.author.first_name and obj.author.last_name:
            return f"{obj.author.first_name} {obj.author.last_name}"
        return obj.author.username

class ArticleListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    author = serializers.SerializerMethodField()
    
    class Meta:
        model = Article
        fields = ['id', 'title', 'excerpt', 'author', 'date', 'read_time', 'image', 'category']

    def get_author(self, obj):
        if obj.author.first_name and obj.author.last_name:
            return f"{obj.author.first_name} {obj.author.last_name}"
        return obj.author.username