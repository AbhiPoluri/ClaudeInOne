# Date & Time Handling

Working with dates, timezones, and scheduling.

## date-fns Library

```typescript
import {
  format,
  parse,
  addDays,
  isBefore,
  differenceInDays,
  startOfDay,
  endOfDay
} from 'date-fns';

// Format dates
const formatted = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

// Parse dates
const parsed = parse('2024-01-15', 'yyyy-MM-dd', new Date());

// Manipulate dates
const tomorrow = addDays(new Date(), 1);
const nextWeek = addDays(new Date(), 7);

// Compare dates
const isExpired = isBefore(expiryDate, new Date());

// Calculate differences
const daysDiff = differenceInDays(new Date(), pastDate);

// Get start/end of day
const dayStart = startOfDay(new Date());
const dayEnd = endOfDay(new Date());
```

## Day.js (Lightweight)

```typescript
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

// Basic operations
const now = dayjs();
const formatted = now.format('YYYY-MM-DD HH:mm:ss');
const tomorrow = now.add(1, 'day');

// Timezone handling
const nyTime = dayjs().tz('America/New_York');
const londonTime = dayjs().tz('Europe/London');

console.log(nyTime.format('HH:mm'));      // New York time
console.log(londonTime.format('HH:mm'));  // London time
```

## Cron Jobs

```typescript
import cron from 'node-cron';
import schedule from 'node-schedule';

// node-cron syntax
// Run every day at 2 AM
cron.schedule('0 2 * * *', async () => {
  console.log('Running daily task');
  await cleanupExpiredTokens();
});

// Run every Monday at 9 AM
cron.schedule('0 9 * * 1', async () => {
  console.log('Weekly report');
  await generateWeeklyReport();
});

// node-schedule syntax
const job = schedule.scheduleJob('0 9 * * 1', async () => {
  console.log('Scheduled task running');
});

// Cancel job
job.cancel();
```

## Timezone Handling

```typescript
function convertToTimezone(date: Date, timezone: string): string {
  return dayjs(date).tz(timezone).format('YYYY-MM-DD HH:mm:ss');
}

// Examples
console.log(convertToTimezone(new Date(), 'America/New_York'));
console.log(convertToTimezone(new Date(), 'Europe/London'));
console.log(convertToTimezone(new Date(), 'Asia/Tokyo'));

// Store times in UTC, display in user's timezone
async function getUserEvents(userId: string) {
  const user = await db.users.findById(userId);
  const events = await db.events.findByUserId(userId);

  return events.map(event => ({
    ...event,
    displayTime: dayjs(event.startTime).tz(user.timezone)
  }));
}
```

## Recurring Schedules

```typescript
import RRule from 'rrule';

// Repeat every weekday at 9 AM
const rule = new RRule({
  freq: RRule.DAILY,
  byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
  dtstart: new Date(2024, 0, 1, 9, 0)
});

// Get next 10 occurrences
const occurrences = rule.all().slice(0, 10);

// Monthly subscription billing
const billingRule = new RRule({
  freq: RRule.MONTHLY,
  bymonthday: 1, // First day of month
  dtstart: new Date()
});
```

## Date Range Queries

```typescript
// Find events in date range
async function getEventsInRange(startDate: Date, endDate: Date) {
  return await db.events.find({
    startTime: { $gte: startDate, $lte: endDate }
  });
}

// Find upcoming events
async function getUpcomingEvents(days: number = 7) {
  const today = dayjs().startOf('day').toDate();
  const futureDate = dayjs().add(days, 'day').endOf('day').toDate();

  return await db.events.find({
    startTime: { $gte: today, $lte: futureDate }
  });
}
```

## Best Practices

✅ **Store in UTC** - Always store dates in UTC
✅ **Display in user timezone** - Convert for display
✅ **Use ISO strings** - For API communication
✅ **Avoid time libraries** - Use date-fns or Day.js
✅ **Test with timezones** - Include timezone in tests

## Resources

- [date-fns Documentation](https://date-fns.org/)
- [Day.js Documentation](https://day.js.org/)
- [RRule Documentation](https://github.com/jakubroztocil/rrule)
