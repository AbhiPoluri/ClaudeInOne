# CI/CD Pipelines

Automated testing, building, and deployment.

## GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## GitLab CI/CD

```yaml
# .gitlab-ci.yml
image: node:20

stages:
  - test
  - build
  - deploy

variables:
  NPM_TOKEN: $NPM_TOKEN

test:
  stage: test
  script:
    - npm ci
    - npm run lint
    - npm run test:unit
    - npm run test:e2e
  coverage: '/coverage: (\d+\.\d+)%/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

build:
  stage: build
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 day

deploy:production:
  stage: deploy
  script:
    - npm ci
    - npm run build
    - npm run deploy
  environment:
    name: production
    url: https://example.com
  only:
    - main
```

## Jenkins Pipeline

```groovy
pipeline {
  agent any
  
  stages {
    stage('Checkout') {
      steps {
        git 'https://github.com/user/repo.git'
      }
    }
    
    stage('Install') {
      steps {
        sh 'npm ci'
      }
    }
    
    stage('Test') {
      steps {
        sh 'npm run test'
        junit 'test-results.xml'
      }
    }
    
    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }
    
    stage('Deploy') {
      when {
        branch 'main'
      }
      steps {
        sh './scripts/deploy.sh'
      }
    }
  }
  
  post {
    always {
      archiveArtifacts artifacts: 'dist/**', allowEmptyArchive: true
    }
  }
}
```

## Environment-Specific Configuration

```typescript
// config/ci.ts
export const getCIConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  
  const config = {
    development: {
      apiUrl: 'http://localhost:3000',
      logLevel: 'debug'
    },
    staging: {
      apiUrl: 'https://staging-api.example.com',
      logLevel: 'info',
      sentryDSN: process.env.SENTRY_DSN
    },
    production: {
      apiUrl: 'https://api.example.com',
      logLevel: 'warn',
      sentryDSN: process.env.SENTRY_DSN,
      analyticsToken: process.env.ANALYTICS_TOKEN
    }
  };
  
  return config[env as keyof typeof config] || config.development;
};
```

## Deployment Strategy

```bash
#!/bin/bash
# scripts/deploy.sh

set -e

ENV=$1
VERSION=$(git describe --tags --always)

echo "Deploying version $VERSION to $ENV"

# Build
npm run build

# Run tests
npm run test

# Deploy based on environment
case $ENV in
  staging)
    npm run deploy:staging
    ;;
  production)
    npm run deploy:production
    # Post-deploy verification
    sleep 10
    ./scripts/health-check.sh https://example.com
    ;;
esac

echo "Deployment complete"
```

## Blue-Green Deployment

```bash
#!/bin/bash
# scripts/blue-green-deploy.sh

BLUE_ENV="prod-blue"
GREEN_ENV="prod-green"
CURRENT=$(cat .current-env)

if [ "$CURRENT" = "blue" ]; then
  TARGET=$GREEN_ENV
  NEXT="green"
else
  TARGET=$BLUE_ENV
  NEXT="blue"
fi

echo "Deploying to $TARGET"

# Deploy
npm run build
npm run deploy:$TARGET

# Smoke tests
npm run test:smoke

# Switch traffic
./switch-traffic.sh $TARGET

# Update current environment marker
echo $NEXT > .current-env

echo "Switched to $NEXT ($TARGET)"
```

## Best Practices

✅ **Fast feedback** - Run fast tests first
✅ **Parallel execution** - Run independent jobs simultaneously
✅ **Cache dependencies** - Reduce install time
✅ **Security secrets** - Use secret management
✅ **Automated rollback** - Quick recovery from failures

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitLab CI/CD](https://docs.gitlab.com/ee/ci/)
- [Jenkins Documentation](https://www.jenkins.io/doc/)
