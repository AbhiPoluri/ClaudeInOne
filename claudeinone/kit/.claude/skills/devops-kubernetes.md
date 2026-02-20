# Kubernetes

Container orchestration platform for deploying and scaling containerized applications.

## Kubernetes Basics

```yaml
# Pod
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
spec:
  containers:
  - name: myapp
    image: myapp:1.0
    ports:
    - containerPort: 3000
```

## Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp
        image: myapp:1.0
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

## Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  type: LoadBalancer
  selector:
    app: myapp
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
```

## kubectl Commands

```bash
# Apply configuration
kubectl apply -f deployment.yaml

# Check deployments
kubectl get deployments
kubectl get pods

# View logs
kubectl logs -f deployment/myapp

# Scale deployment
kubectl scale deployment myapp --replicas=5

# Update image
kubectl set image deployment/myapp myapp=myapp:2.0

# Delete deployment
kubectl delete deployment myapp
```

## Best Practices

✅ **Use namespaces** - Organize resources
✅ **Resource limits** - Set CPU and memory
✅ **Liveness/readiness probes** - Health checks
✅ **ConfigMaps for config** - Externalize configuration
✅ **Secrets for sensitive data** - Never hardcode secrets

## Resources

- [Kubernetes Docs](https://kubernetes.io/docs/)
- [kubectl Reference](https://kubernetes.io/docs/reference/kubectl/)
