from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Categories"


class Article(models.Model):
    title = models.CharField(max_length=200)
    excerpt = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='articles')
    date = models.DateField()
    read_time = models.CharField(max_length=20)
    image = models.URLField()
    content = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='articles')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=10, choices=[('draft', 'Draft'), ('published', 'Published')], default='draft')


    def __str__(self):
        return self.title
