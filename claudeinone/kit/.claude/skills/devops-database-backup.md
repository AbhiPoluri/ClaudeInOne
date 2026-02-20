# Database Backup & Recovery

Automated backup strategies and recovery procedures.

## PostgreSQL Backup

```bash
# Full backup
pg_dump -U user -h localhost myapp > backup.sql

# Compressed backup
pg_dump -U user -h localhost -Fc myapp > backup.dump

# With data directory
pg_basebackup -U user -h localhost -D ./backup -Ft -z

# Restore from backup
psql -U user myapp < backup.sql

# Restore from compressed
pg_restore -U user -h localhost -d myapp backup.dump
```

## Automated Backups

```typescript
import cron from 'node-cron';
import { exec } from 'child_process';

// Daily backup at 2 AM
cron.schedule('0 2 * * *', async () => {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `backup-${timestamp}.dump`;

  const command = `pg_dump -U ${DB_USER} -h ${DB_HOST} ${DB_NAME} | gzip > /backups/${filename}`;

  exec(command, (error) => {
    if (error) {
      console.error('Backup failed:', error);
      // Alert on failure
    } else {
      console.log(`Backup created: ${filename}`);
    }
  });
});
```

## Backup Verification

```typescript
async function verifyBackup(backupFile: string) {
  // Restore to test database
  const command = `pg_restore -U test_user -h localhost -d test_db ${backupFile}`;

  // Run validation queries
  const result = await runQuery('SELECT COUNT(*) FROM users');
  
  if (result.rowCount > 0) {
    console.log('Backup verified successfully');
    return true;
  }
  
  return false;
}
```

## Best Practices

✅ **Regular backups** - Daily minimum
✅ **Test restores** - Verify backups work
✅ **Offsite storage** - Protect against data loss
✅ **Retention policy** - Balance storage costs
✅ **Encryption** - Secure backup data

## Resources

- [PostgreSQL Backup & Restore](https://www.postgresql.org/docs/current/backup.html)
