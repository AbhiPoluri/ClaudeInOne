# Go

Statically-typed, compiled language for building fast, concurrent backend services.

## Hello World

```go
package main

import (
    "fmt"
    "net/http"
    "log"
)

func main() {
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "Hello, World!")
    })
    
    log.Println("Server listening on :8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}
```

## HTTP Server with Chi Router

```go
package main

import (
    "github.com/go-chi/chi/v5"
    "encoding/json"
    "net/http"
)

type User struct {
    ID    int    `json:"id"`
    Name  string `json:"name"`
    Email string `json:"email"`
}

func main() {
    r := chi.NewRouter()
    
    r.Get("/users/{id}", func(w http.ResponseWriter, r *http.Request) {
        id := chi.URLParam(r, "id")
        user := User{ID: 1, Name: "John", Email: "john@example.com"}
        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(user)
    })
    
    r.Post("/users", func(w http.ResponseWriter, r *http.Request) {
        var user User
        json.NewDecoder(r.Body).Decode(&user)
        w.WriteHeader(http.StatusCreated)
        json.NewEncoder(w).Encode(user)
    })
    
    http.ListenAndServe(":8080", r)
}
```

## Goroutines & Concurrency

```go
package main

import (
    "fmt"
    "time"
    "sync"
)

func worker(id int, jobs <-chan int, results chan<- int) {
    for j := range jobs {
        fmt.Println("Worker", id, "processing job", j)
        results <- j * 2
    }
}

func main() {
    jobs := make(chan int, 100)
    results := make(chan int, 100)
    
    // Start workers
    for w := 1; w <= 3; w++ {
        go worker(w, jobs, results)
    }
    
    // Send jobs
    for j := 1; j <= 9; j++ {
        jobs <- j
    }
    close(jobs)
    
    // Collect results
    for a := 1; a <= 9; a++ {
        <-results
    }
}

// WaitGroup for synchronization
var wg sync.WaitGroup
wg.Add(1)
go func() {
    defer wg.Done()
    // work
}()
wg.Wait()
```

## Error Handling

```go
package main

import (
    "errors"
    "fmt"
)

func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}

func main() {
    result, err := divide(10, 0)
    if err != nil {
        fmt.Println("Error:", err)
        return
    }
    fmt.Println("Result:", result)
}
```

## Database with GORM

```go
import "gorm.io/gorm"

type User struct {
    ID    uint
    Name  string
    Email string
}

func main() {
    db, _ := gorm.Open(postgres.Open("dsn"), &gorm.Config{})
    
    // Create
    db.Create(&User{Name: "John", Email: "john@example.com"})
    
    // Read
    var user User
    db.First(&user, 1)
    
    // Update
    db.Model(&user).Update("Name", "Jane")
    
    // Delete
    db.Delete(&user)
    
    // Query
    var users []User
    db.Where("email LIKE ?", "%example.com").Find(&users)
}
```

## Testing

```go
package main

import "testing"

func TestDivide(t *testing.T) {
    result, err := divide(10, 2)
    if err != nil {
        t.Fatalf("Expected no error, got %v", err)
    }
    if result != 5 {
        t.Errorf("Expected 5, got %v", result)
    }
}
```

## Best Practices

1. **Handle errors explicitly**
2. **Use goroutines for concurrency**
3. **Leverage strong typing**
4. **Use interfaces for flexibility**
5. **Write idiomatic Go code**
6. **Use context for cancellation**
7. **Implement proper logging**

## Resources

- [Go Official Docs](https://golang.org/doc/)
- [Effective Go](https://golang.org/doc/effective_go)
- [Go by Example](https://gobyexample.com/)
