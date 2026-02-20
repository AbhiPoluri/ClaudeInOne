# FastAPI

Modern, fast Python web framework for building APIs with automatic documentation and type validation.

## Hello World

```python
from fastapi import FastAPI
from typing import Optional

app = FastAPI()

@app.get("/")
async def read_root():
    return {"message": "Hello, World!"}

@app.get("/items/{item_id}")
async def read_item(item_id: int, q: Optional[str] = None):
    return {"item_id": item_id, "q": q}

# Run: uvicorn main:app --reload
```

## Request/Response Models (Pydantic)

```python
from pydantic import BaseModel

class User(BaseModel):
    id: int
    name: str
    email: str
    age: Optional[int] = None

@app.post("/users/")
async def create_user(user: User):
    return {"created": user}

# Validation happens automatically
# POST /users/ with invalid data returns 422 error
```

## Path Parameters, Query Parameters

```python
@app.get("/users/{user_id}")
async def read_user(
    user_id: int,              # Path parameter
    skip: int = 0,             # Query parameter with default
    limit: int = 10,
    search: Optional[str] = None
):
    return {"user_id": user_id, "skip": skip, "limit": limit}
```

## Request Body

```python
@app.post("/users/")
async def create_user(user: User):
    # user is automatically parsed and validated
    # Returns 422 if validation fails
    return user

# With multiple body parameters
class Item(BaseModel):
    name: str
    price: float

@app.post("/purchases/")
async def create_purchase(user: User, item: Item):
    return {"user": user, "item": item}
```

## Status Codes & Headers

```python
from fastapi import status

@app.post("/users/", status_code=status.HTTP_201_CREATED)
async def create_user(user: User):
    return user

@app.get("/items/", response_model=List[Item])
async def list_items():
    return [Item(name="item1", price=10)]
```

## Dependencies & Middleware

```python
from fastapi import Depends, Header

async def verify_token(token: str = Header(...)):
    if token != "secret":
        raise Exception("Invalid token")
    return token

@app.get("/protected")
async def protected_route(token: str = Depends(verify_token)):
    return {"token": token}

# Database dependency
async def get_db():
    db = Database()
    try:
        yield db
    finally:
        await db.close()

@app.get("/users")
async def list_users(db = Depends(get_db)):
    return await db.users.all()
```

## Exception Handling

```python
from fastapi import HTTPException

@app.get("/users/{user_id}")
async def read_user(user_id: int):
    user = await db.users.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.exception_handler(ValueError)
async def value_error_handler(request, exc):
    return JSONResponse(
        status_code=400,
        content={"detail": str(exc)},
    )
```

## Automatic Documentation

FastAPI automatically generates OpenAPI docs:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## Best Practices

1. **Use type hints**: Enables validation and docs
2. **Async by default**: Use async functions for better performance
3. **Pydantic models**: For request/response validation
4. **Dependencies**: For reusable logic (auth, DB access)
5. **Logging**: Use Python's logging module
6. **Testing**: pytest with TestClient

## Testing

```python
from fastapi.testclient import TestClient

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello, World!"}
```

## Resources

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Pydantic Validation](https://docs.pydantic.dev/)
- [Async Python](https://docs.python.org/3/library/asyncio.html)
