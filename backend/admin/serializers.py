from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from blog.models import Category, Article

class AdminUserSerializer(serializers.ModelSerializer):
    permission = serializers.SerializerMethodField()
    isActive = serializers.BooleanField(source='is_active')

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'first_name', 'last_name', 'permission', 'isActive', 'date_joined']

    def get_permission(self, obj):
        return 'admin' if obj.is_staff else 'user'
    
    def validate_email(self, value):
        print(value)
        if User.objects.filter(email=value).exclude(id=self.instance.id).exists():
            raise serializers.ValidationError("User with this Email already exists!")
        print('yes')
        return value
    
    def update(self, instance, validated_data):
        # Update basic fields if provided
        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        
        # Handle password separately using set_password if provided
        password = validated_data.get('password')
        if password:
            instance.set_password(password)

        instance.save()
        return instance
        
class AdminCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']
    
    def validate_name(self, value):
        if Category.objects.filter(name=value).exclude(id=getattr(self.instance, 'id', None)).exists():
            raise serializers.ValidationError("Category with this name already exists!")
        return value

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.save()
        return instance

class AdminArticleSerializer(serializers.ModelSerializer):
    category_data = AdminCategorySerializer(source='category', read_only=True)
    author_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Article
        fields = ['id', 'title', 'excerpt', 'content', 'author', 'author_name', 'date', 'read_time', 
                 'image', 'category', 'category_data', 'status', 'created_at', 'updated_at']
    
    def get_author_name(self, obj):
        if obj.author.first_name and obj.author.last_name:
            return f"{obj.author.first_name} {obj.author.last_name}"
        return obj.author.username
    
    def validate_title(self, value):
        if Article.objects.filter(title=value).exclude(id=getattr(self.instance, 'id', None)).exists():
            raise serializers.ValidationError("Article with this title already exists!")
        return value

    def update(self, instance, validated_data):
        
        # Update category if provided
        category_id = validated_data.get('category')
        if category_id:
            instance.category_id = category_id.id if hasattr(category_id, 'id') else category_id
            
        # Update author if provided
        author_id = validated_data.get('author')
        if author_id:
            instance.author_id = author_id.id if hasattr(author_id, 'id') else author_id
            
        # Update title if provided
        for key, value in validated_data.items():
            if value:
                setattr(instance, key, value)

        instance.save()
        return instance
        
