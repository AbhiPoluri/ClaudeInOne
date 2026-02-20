# Rust

Systems language with memory safety without garbage collection, ideal for performance-critical applications.

## Basic Syntax

```rust
fn main() {
    let x = 5;              // immutable
    let mut y = 5;          // mutable
    y += 1;
    
    let s = String::from("hello");
    println!("{}", s);
}
```

## Ownership & Borrowing

```rust
// Ownership
let s1 = String::from("hello");
let s2 = s1;  // s1 no longer valid

// Borrowing (references)
let s1 = String::from("hello");
let len = calculate_length(&s1);  // borrow, don't take ownership

fn calculate_length(s: &String) -> usize {
    s.len()
}

// Mutable borrow
let mut s = String::from("hello");
change_string(&mut s);

fn change_string(s: &mut String) {
    s.push_str(" world");
}
```

## Result & Error Handling

```rust
use std::fs::File;
use std::io::Read;

fn read_file(path: &str) -> Result<String, std::io::Error> {
    let mut file = File::open(path)?;  // propagate error
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    Ok(contents)
}

// Match on Result
match read_file("file.txt") {
    Ok(content) => println!("{}", content),
    Err(e) => eprintln!("Error: {}", e),
}
```

## Web Server with Actix

```rust
use actix_web::{web, App, HttpServer, HttpResponse};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct User {
    id: u32,
    name: String,
}

async fn get_user(id: web::Path<u32>) -> HttpResponse {
    let user = User {
        id: id.into_inner(),
        name: "John".to_string(),
    };
    HttpResponse::Ok().json(user)
}

async fn create_user(user: web::Json<User>) -> HttpResponse {
    HttpResponse::Created().json(user.into_inner())
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .route("/users/{id}", web::get().to(get_user))
            .route("/users", web::post().to(create_user))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
```

## Traits & Generics

```rust
trait Drawable {
    fn draw(&self);
}

struct Circle {
    radius: f64,
}

impl Drawable for Circle {
    fn draw(&self) {
        println!("Drawing circle with radius {}", self.radius);
    }
}

// Generics
fn largest<T: PartialOrd + Copy>(list: &[T]) -> T {
    let mut largest = list[0];
    for &item in list {
        if item > largest {
            largest = item;
        }
    }
    largest
}
```

## Async/Await

```rust
use tokio::task;

async fn fetch_data(url: &str) -> Result<String, reqwest::Error> {
    let response = reqwest::get(url).await?;
    response.text().await
}

#[tokio::main]
async fn main() {
    let data = fetch_data("https://api.example.com/data").await;
    match data {
        Ok(body) => println!("{}", body),
        Err(e) => eprintln!("Error: {}", e),
    }
}
```

## Testing

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_addition() {
        assert_eq!(2 + 2, 4);
    }

    #[test]
    #[should_panic]
    fn test_panic() {
        panic!("This test panics");
    }
}
```

## Best Practices

1. **Leverage the type system**
2. **Use Option/Result for safety**
3. **Write idiomatic Rust code**
4. **Use lifetimes correctly**
5. **Implement proper error handling**
6. **Use async/await for concurrency**
7. **Write comprehensive tests**

## Resources

- [The Rust Book](https://doc.rust-lang.org/book/)
- [Rust by Example](https://doc.rust-lang.org/rust-by-example/)
- [Actix Documentation](https://actix.rs/)
