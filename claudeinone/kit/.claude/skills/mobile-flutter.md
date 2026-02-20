# Flutter

Google's cross-platform framework for mobile, web, and desktop.

## Setup

```bash
flutter create my_app
cd my_app
flutter pub add http provider
flutter run
```

## Basic Widget

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int count = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Counter')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('Count: $count'),
            ElevatedButton(
              onPressed: () => setState(() => count++),
              child: const Text('Increment'),
            )
          ],
        ),
      ),
    );
  }
}
```

## API Integration

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class User {
  final String id;
  final String email;
  final String name;

  User({
    required this.id,
    required this.email,
    required this.name,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      email: json['email'],
      name: json['name'],
    );
  }
}

class ApiClient {
  static const String baseUrl = 'https://api.example.com';

  static Future<List<User>> getUsers() async {
    final response = await http.get(
      Uri.parse('$baseUrl/users'),
    );

    if (response.statusCode == 200) {
      final List<dynamic> json = jsonDecode(response.body);
      return json.map((item) => User.fromJson(item)).toList();
    } else {
      throw Exception('Failed to load users');
    }
  }

  static Future<User> createUser(String email, String name) async {
    final response = await http.post(
      Uri.parse('$baseUrl/users'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'name': name}),
    );

    if (response.statusCode == 201) {
      return User.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Failed to create user');
    }
  }
}
```

## Provider State Management

```dart
import 'package:provider/provider.dart';

class AuthNotifier extends ChangeNotifier {
  User? _user;

  User? get user => _user;

  Future<void> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('https://api.example.com/auth/login'),
        body: {'email': email, 'password': password},
      );

      if (response.statusCode == 200) {
        _user = User.fromJson(jsonDecode(response.body));
        notifyListeners();
      }
    } catch (e) {
      rethrow;
    }
  }

  void logout() {
    _user = null;
    notifyListeners();
  }
}

class LoginScreen extends StatefulWidget {
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  late TextEditingController emailController;
  late TextEditingController passwordController;

  @override
  void initState() {
    super.initState();
    emailController = TextEditingController();
    passwordController = TextEditingController();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Login')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: emailController,
              decoration: const InputDecoration(labelText: 'Email'),
            ),
            TextField(
              controller: passwordController,
              obscureText: true,
              decoration: const InputDecoration(labelText: 'Password'),
            ),
            ElevatedButton(
              onPressed: () async {
                await context.read<AuthNotifier>().login(
                  emailController.text,
                  passwordController.text,
                );
              },
              child: const Text('Login'),
            )
          ],
        ),
      ),
    );
  }
}
```

## Navigation

```dart
class AppRouter {
  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case '/':
        return MaterialPageRoute(builder: (_) => const HomeScreen());
      case '/login':
        return MaterialPageRoute(builder: (_) => const LoginScreen());
      case '/profile':
        return MaterialPageRoute(builder: (_) => const ProfileScreen());
      default:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            body: Center(child: Text('No route for ${settings.name}')),
          ),
        );
    }
  }
}

// In MyApp:
onGenerateRoute: AppRouter.generateRoute,
```

## Build & Deploy

```bash
# Build APK
flutter build apk

# Build iOS
flutter build ios

# Build web
flutter build web

# Test
flutter test
```

## Best Practices

✅ **Use Provider** - State management pattern
✅ **Hot reload** - Fast development cycle
✅ **Bloc pattern** - Complex state management
✅ **Testing** - Unit, widget, and integration tests
✅ **Performance** - Use RepaintBoundary, const widgets

## Resources

- [Flutter Official](https://flutter.dev/)
- [Flutter Docs](https://docs.flutter.dev/)
- [Provider Package](https://pub.dev/packages/provider)
