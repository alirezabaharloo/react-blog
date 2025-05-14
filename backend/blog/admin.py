from django.contrib import admin
from .models import Category, Article

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category', 'date', 'read_time')
    list_filter = ('category', 'date')
    search_fields = ('title', 'content', 'author')
    date_hierarchy = 'date'
