# Pulumi

## Overview
Define cloud infrastructure as TypeScript/Python/Go code instead of YAML. Pulumi uses real programming languages for IaC.

## Setup

```bash
curl -fsSL https://get.pulumi.com | sh
pulumi login
mkdir infra && cd infra
pulumi new aws-typescript
```

## S3 + CloudFront

```typescript
import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

const bucket = new aws.s3.BucketV2('site-assets', {
  tags: { Environment: pulumi.getStack() }
});

new aws.s3.BucketPublicAccessBlock('site-block', {
  bucket: bucket.id,
  blockPublicAcls: true,
  blockPublicPolicy: true,
});

const distribution = new aws.cloudfront.Distribution('cdn', {
  origins: [{
    domainName: bucket.bucketRegionalDomainName,
    originId: 'S3Origin',
  }],
  enabled: true,
  defaultCacheBehavior: {
    targetOriginId: 'S3Origin',
    viewerProtocolPolicy: 'redirect-to-https',
    allowedMethods: ['GET', 'HEAD'],
    cachedMethods: ['GET', 'HEAD'],
    forwardedValues: { queryString: false, cookies: { forward: 'none' } },
  },
  restrictions: { geoRestriction: { restrictionType: 'none' } },
  viewerCertificate: { cloudfrontDefaultCertificate: true },
});

export const cdnUrl = distribution.domainName;
```

## ECS Fargate Service

```typescript
import * as awsx from '@pulumi/awsx';

const repo = new awsx.ecr.Repository('app');
const image = new awsx.ecr.Image('app-image', { repositoryUrl: repo.url, context: '../app' });

const cluster = new aws.ecs.Cluster('cluster');
const lb = new awsx.lb.ApplicationLoadBalancer('alb');

const service = new awsx.ecs.FargateService('app', {
  cluster: cluster.arn,
  taskDefinitionArgs: {
    container: {
      name: 'app',
      image: image.imageUri,
      cpu: 256, memory: 512,
      portMappings: [lb.defaultTargetGroup],
    }
  },
  desiredCount: 2,
});

export const url = lb.loadBalancer.dnsName;
```

## Deploy

```bash
pulumi preview   # show changes
pulumi up        # deploy
pulumi destroy   # tear down
```

## Best Practices
- Use `pulumi.Config` for environment-specific values
- Store secrets with `config.requireSecret()` (encrypted in state)
- Use stack references to share outputs between stacks
- Create component resources for reusable infrastructure patterns

## Resources
- [Pulumi docs](https://www.pulumi.com/docs/)
- [Pulumi AWS examples](https://www.pulumi.com/registry/packages/aws/)
