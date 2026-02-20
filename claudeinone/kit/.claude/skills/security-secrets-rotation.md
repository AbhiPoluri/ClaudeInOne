# Secrets Rotation

Automating secret updates and rotation.

## Rotation Strategy

```typescript
interface SecretMetadata {
  name: string;
  createdAt: Date;
  rotatedAt: Date;
  expiresAt: Date;
  status: 'active' | 'rotating' | 'expired';
}

async function rotateSecret(secretName: string) {
  // Create new secret
  const newSecret = generateSecureSecret();
  
  // Store new secret with metadata
  await vault.write(`secret/${secretName}-new`, {
    value: newSecret,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  });

  // Double-write period (both old and new work)
  // Update application to accept both

  // After validation, retire old secret
  await vault.delete(`secret/${secretName}`);
  
  // Rename new to current
  await vault.rename(`secret/${secretName}-new`, `secret/${secretName}`);
}
```

## Automated Rotation

```typescript
import cron from 'node-cron';

// Rotate secrets monthly
cron.schedule('0 0 1 * *', async () => {
  const secrets = ['API_KEY', 'DB_PASSWORD', 'JWT_SECRET'];
  
  for (const secret of secrets) {
    await rotateSecret(secret);
    console.log(`Rotated ${secret}`);
  }
});
```

## Best Practices

✅ **Regular rotation** - Monthly minimum
✅ **Double-write period** - Gradual transition
✅ **Audit logging** - Track all rotations
✅ **Automation** - Scheduled rotation
✅ **Monitoring** - Alert on rotation failures

## Resources

- [Secrets Management](https://www.vaultproject.io/docs/secrets/rotation)
