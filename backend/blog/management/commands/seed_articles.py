import datetime
from django.core.management.base import BaseCommand
from blog.models import Category, Article
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Seeds the database with initial categories and articles'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('Seeding database with articles...'))
        
        # Delete existing data
        Article.objects.all().delete()
        Category.objects.all().delete()
        
        # Create categories
        self.stdout.write('Creating categories...')
        categories_data = [
            {
                "id": 1,
                "name": "Technology",
                "description": "Articles about technology and innovation"
            },
            {
                "id": 2,
                "name": "Design",
                "description": "Articles about UI/UX and design principles"
            },
            {
                "id": 3,
                "name": "Programming",
                "description": "Articles about programming and development"
            },
            {
                "id": 4,
                "name": "Architecture",
                "description": "Articles about software architecture"
            }
        ]
        
        categories = {}
        for category_data in categories_data:
            category = Category.objects.create(
                name=category_data['name'],
                description=category_data['description']
            )
            categories[category_data['id']] = category
            self.stdout.write(f"  - {category.name}")
        
        # Create articles
        self.stdout.write('Creating articles...')
        articles_data = [
            {
                "id": 1,
                "title": "The Future of Web Development",
                "excerpt": "Exploring the latest trends and technologies shaping the future of web development in 2024.",
                "author": "Sarah Johnson",
                "date": "2024-03-15",
                "readTime": 5,
                "categoryId": 1,
                "image": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop",
                "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            },
            {
                "id": 2,
                "title": "Mastering React Hooks",
                "excerpt": "A comprehensive guide to understanding and implementing React Hooks in your applications.",
                "author": "Michael Chen",
                "date": "2024-03-14",
                "readTime": 8,
                "categoryId": 3,
                "image": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop",
                "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            },
            {
                "id": 3,
                "title": "The Art of UI/UX Design",
                "excerpt": "Learn the fundamental principles of creating beautiful and user-friendly interfaces.",
                "author": "Emma Wilson",
                "date": "2024-03-13",
                "readTime": 6,
                "categoryId": 2,
                "image": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop",
                "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            },
            {
                "id": 4,
                "title": "Building Scalable Applications",
                "excerpt": "Best practices and strategies for creating applications that can grow with your business.",
                "author": "David Brown",
                "date": "2024-03-12",
                "readTime": 7,
                "categoryId": 4,
                "image": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop",
                "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            },
            {
                "id": 5,
                "title": "Introduction to Machine Learning",
                "excerpt": "A beginner's guide to understanding the fundamentals of machine learning.",
                "author": "Jennifer Lee",
                "date": "2024-03-11",
                "readTime": 9,
                "categoryId": 1,
                "image": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop",
                "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            },
            {
                "id": 6,
                "title": "Modern JavaScript Techniques",
                "excerpt": "Explore advanced JavaScript features and patterns for cleaner, more efficient code.",
                "author": "Robert Smith",
                "date": "2024-03-10",
                "readTime": 7,
                "categoryId": 3,
                "image": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop",
                "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            },
            {
                "id": 7,
                "title": "Microservices Architecture Explained",
                "excerpt": "Understanding the benefits and challenges of implementing microservices in your organization.",
                "author": "Alex Thompson",
                "date": "2024-03-09",
                "readTime": 10,
                "categoryId": 4,
                "image": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop",
                "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            },
            {
                "id": 8,
                "title": "The Psychology of Color in Design",
                "excerpt": "How color choices impact user perception and behavior in digital interfaces.",
                "author": "Sophia Garcia",
                "date": "2024-03-08",
                "readTime": 6,
                "categoryId": 2,
                "image": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop",
                "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            },
            {
                "id": 9,
                "title": "Getting Started with TypeScript",
                "excerpt": "A practical introduction to TypeScript for JavaScript developers.",
                "author": "Daniel Kim",
                "date": "2024-03-07",
                "readTime": 8,
                "categoryId": 3,
                "image": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop",
                "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            },
            {
                "id": 10,
                "title": "The Rise of Edge Computing",
                "excerpt": "How edge computing is transforming data processing and improving application performance.",
                "author": "Olivia Martinez",
                "date": "2024-03-06",
                "readTime": 7,
                "categoryId": 1,
                "image": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop",
                "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            },
            {
                "id": 11,
                "title": "Clean Code Principles",
                "excerpt": "Essential practices for writing maintainable and readable code that your team will love.",
                "author": "James Wilson",
                "date": "2024-03-05",
                "readTime": 9,
                "categoryId": 3,
                "image": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop",
                "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            },
            {
                "id": 12,
                "title": "Responsive Design Best Practices",
                "excerpt": "Creating websites that look great on any device with modern responsive design techniques.",
                "author": "Emily Parker",
                "date": "2024-03-04",
                "readTime": 6,
                "categoryId": 2,
                "image": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop",
                "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            }
        ]
        
        for article_data in articles_data:
            date_obj = datetime.datetime.strptime(article_data['date'], '%Y-%m-%d').date()
            article = Article.objects.create(
                title=article_data['title'],
                excerpt=article_data['excerpt'],
                author=User.objects.get(username='admin'),
                date=date_obj,
                read_time=article_data['readTime'],
                category=categories[article_data['categoryId']],
                image=article_data['image'],
                content=article_data['content']
            )
            self.stdout.write(f"  - {article.title}")
        
        self.stdout.write(self.style.SUCCESS('Database seeded successfully!')) 