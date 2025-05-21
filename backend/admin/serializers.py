from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password


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
        