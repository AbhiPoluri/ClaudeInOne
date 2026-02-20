# Laravel

PHP framework with elegant syntax for rapid web application development.

## Routes & Controllers

```php
// routes/web.php
Route::get('/users/{id}', [UserController::class, 'show']);
Route::post('/users', [UserController::class, 'store']);
Route::resource('posts', PostController::class);  // RESTful routes

// app/Http/Controllers/UserController.php
class UserController extends Controller {
    public function show($id) {
        $user = User::findOrFail($id);
        return view('users.show', ['user' => $user]);
    }
    
    public function store(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
        ]);
        
        $user = User::create($validated);
        return redirect('/users/' . $user->id);
    }
}
```

## Eloquent ORM

```php
// app/Models/User.php
class User extends Model {
    protected $fillable = ['name', 'email', 'password'];
    protected $hidden = ['password'];
    
    public function posts() {
        return $this->hasMany(Post::class);
    }
}

// Queries
$user = User::find(1);
$user = User::where('email', 'john@example.com')->first();
$users = User::where('age', '>', 18)->get();

// Relationships
$user = User::with('posts')->find(1);
$posts = $user->posts;

// Create/Update
$user = User::create(['name' => 'John', 'email' => 'john@example.com']);
$user->update(['name' => 'Jane']);
$user->delete();
```

## Migrations & Schema

```php
// database/migrations/2023_10_01_create_users_table.php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->timestamp('email_verified_at')->nullable();
    $table->timestamps();
    $table->index('email');
});
```

## Views (Blade)

```blade
<!-- resources/views/users/show.blade.php -->
@extends('layouts.app')

@section('content')
    <h1>{{ $user->name }}</h1>
    <p>{{ $user->email }}</p>
    
    @if($user->posts->count())
        <ul>
        @foreach($user->posts as $post)
            <li>{{ $post->title }}</li>
        @endforeach
        </ul>
    @else
        <p>No posts yet</p>
    @endif
@endsection
```

## Middleware & Authentication

```php
// app/Http/Middleware/CheckAdmin.php
class CheckAdmin {
    public function handle(Request $request, Closure $next) {
        if (!auth()->user()?->isAdmin()) {
            abort(403);
        }
        return $next($request);
    }
}

// routes/web.php
Route::middleware('auth', 'admin')->group(function () {
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
});
```

## Validation

```php
$validated = $request->validate([
    'name' => 'required|string|max:255',
    'email' => 'required|email|unique:users',
    'password' => 'required|confirmed|min:8',
    'age' => 'integer|min:18',
]);
```

## Testing

```php
class UserTest extends TestCase {
    public function test_can_create_user() {
        $response = $this->post('/users', [
            'name' => 'John',
            'email' => 'john@example.com',
        ]);
        
        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com'
        ]);
    }
}
```

## Best Practices

1. **Use artisan commands**
2. **Leverage Eloquent relationships**
3. **Keep controllers clean**
4. **Use middleware for cross-cutting concerns**
5. **Write comprehensive tests**
6. **Use queues for long operations**

## Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Eloquent ORM](https://laravel.com/docs/eloquent)
- [Laravel Testing](https://laravel.com/docs/testing)
