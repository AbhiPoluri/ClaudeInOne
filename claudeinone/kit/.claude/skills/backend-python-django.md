# Django

Batteries-included Python web framework with ORM, admin, and built-in security.

## Models & ORM

```python
from django.db import models

class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']

# Queries
users = User.objects.filter(name__icontains='john')
user = User.objects.get(id=1)
User.objects.create(name='Jane', email='jane@example.com')
user.delete()

# Relations
class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)

posts = User.objects.filter(id=1).prefetch_related('post_set')
```

## Views & URLs

```python
from django.views import View
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

class UserView(View):
    def get(self, request, user_id):
        user = User.objects.get(id=user_id)
        return JsonResponse({'id': user.id, 'name': user.name})
    
    def post(self, request):
        data = json.loads(request.body)
        user = User.objects.create(**data)
        return JsonResponse({'id': user.id}, status=201)

# Function-based views
@require_http_methods(['GET', 'POST'])
def user_list(request):
    if request.method == 'GET':
        users = User.objects.all()
        return JsonResponse(list(users.values()), safe=False)
    else:
        data = json.loads(request.body)
        user = User.objects.create(**data)
        return JsonResponse({'id': user.id}, status=201)

# URLs
from django.urls import path
urlpatterns = [
    path('users/<int:user_id>/', UserView.as_view()),
    path('users/', user_list),
]
```

## Forms & Validation

```python
from django import forms

class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['name', 'email']
    
    def clean_email(self):
        email = self.cleaned_data['email']
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError('Email already exists')
        return email

# In view
form = UserForm(request.POST)
if form.is_valid():
    form.save()
else:
    return JsonResponse(form.errors, status=400)
```

## Admin Interface

```python
from django.contrib import admin

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'email']
    readonly_fields = ['created_at']
```

## Middleware & Authentication

```python
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt

@login_required
def protected_view(request):
    return JsonResponse({'user': request.user.username})

# Middleware
from django.utils.deprecation import MiddlewareMixin

class CustomMiddleware(MiddlewareMixin):
    def process_request(self, request):
        request.custom_data = 'value'
        return None
```

## Django REST Framework

```python
from rest_framework import serializers, viewsets
from rest_framework.decorators import action

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email']

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    @action(detail=True, methods=['get'])
    def recent_posts(self, request, pk=None):
        user = self.get_object()
        posts = user.post_set.all()[:5]
        return Response(PostSerializer(posts, many=True).data)

# Router
from rest_framework.routers import DefaultRouter
router = DefaultRouter()
router.register(r'users', UserViewSet)
urlpatterns = router.urls
```

## Database Migrations

```bash
# Create migration
python manage.py makemigrations

# Apply migration
python manage.py migrate

# Show migrations
python manage.py showmigrations

# Rollback
python manage.py migrate app 0001
```

## Testing

```python
from django.test import TestCase, Client

class UserTests(TestCase):
    def setUp(self):
        self.user = User.objects.create(name='John', email='john@example.com')
    
    def test_user_creation(self):
        self.assertEqual(self.user.name, 'John')
    
    def test_api_get(self):
        client = Client()
        response = client.get(f'/users/{self.user.id}/')
        self.assertEqual(response.status_code, 200)
```

## Performance & Best Practices

1. **Use select_related/prefetch_related** for joins
2. **Index frequently queried fields**
3. **Use Django ORM, avoid raw SQL**
4. **Implement proper caching**
5. **Use Celery for async tasks**
6. **Implement proper error handling**
7. **Use middleware for cross-cutting concerns**

## Resources

- [Django Official Docs](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Two Scoops of Django](https://www.feldroy.com/books/two-scoops-of-django)
