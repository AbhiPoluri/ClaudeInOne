# Load & Stress Testing

Testing application behavior under load.

## Apache JMeter

```bash
# Create test plan graphically
jmeter

# Run from command line
jmeter -n -t test.jmx -l results.jtl -j logs.txt
```

## Locust (Python-based)

```python
from locust import HttpUser, task, between

class APIUser(HttpUser):
    wait_time = between(1, 5)

    @task(3)
    def get_users(self):
        self.client.get("/api/users")

    @task(1)
    def create_user(self):
        self.client.post("/api/users", {
            "email": "test@example.com",
            "name": "Test User"
        })

# Run: locust -f locustfile.py --host=http://localhost:3000
```

## Artillery Load Testing

```yaml
# load-test.yml
config:
  target: "http://localhost:3000"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 60
      arrivalRate: 20
      name: "Sustained load"

scenarios:
  - name: "API Load Test"
    flow:
      - get:
          url: "/api/users"
      - post:
          url: "/api/users"
          json:
            email: "test@example.com"
            name: "Test"
```

```bash
artillery run load-test.yml
```

## Best Practices

✅ **Gradual ramp-up** - Start low, increase gradually
✅ **Realistic scenarios** - Mimic actual usage
✅ **Monitor metrics** - CPU, memory, database
✅ **Identify bottlenecks** - Find breaking points
✅ **Set thresholds** - Define acceptable limits

## Resources

- [Apache JMeter](https://jmeter.apache.org/)
- [Locust](https://locust.io/)
- [Artillery](https://artillery.io/)
