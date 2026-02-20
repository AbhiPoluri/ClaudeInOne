# SaaS User Onboarding

Implementing effective user onboarding flows.

## Onboarding Checklist

```typescript
interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
  action?: () => Promise<void>;
}

interface OnboardingProgress {
  userId: string;
  steps: OnboardingStep[];
  completedAt?: Date;
  completionPercentage: number;
}

async function createOnboardingFlow(userId: string) {
  const steps: OnboardingStep[] = [
    {
      id: 'profile',
      title: 'Complete Profile',
      description: 'Add name and avatar',
      completed: false,
      required: true
    },
    {
      id: 'payment',
      title: 'Add Payment Method',
      description: 'Set up billing',
      completed: false,
      required: true
    },
    {
      id: 'workspace',
      title: 'Create First Workspace',
      description: 'Organize your work',
      completed: false,
      required: false
    },
    {
      id: 'invite',
      title: 'Invite Team Members',
      description: 'Collaborate with others',
      completed: false,
      required: false
    }
  ];

  await db.onboarding.create({
    userId,
    steps,
    completionPercentage: 0
  });
}

async function completeStep(userId: string, stepId: string) {
  const progress = await db.onboarding.findByUserId(userId);
  const step = progress.steps.find(s => s.id === stepId);

  if (step) {
    step.completed = true;

    const completed = progress.steps.filter(s => s.completed).length;
    progress.completionPercentage = (completed / progress.steps.length) * 100;

    if (progress.completionPercentage === 100) {
      progress.completedAt = new Date();
    }

    await db.onboarding.update(userId, progress);
  }
}
```

## Progress Tracking

```typescript
// Track engagement metrics
interface OnboardingMetrics {
  userId: string;
  startDate: Date;
  timeToCompletion?: number;
  stepsCompleted: number;
  totalSteps: number;
  conversionRate: number;
  churnRisk: boolean;
}

async function analyzeOnboardingHealth(userId: string) {
  const progress = await db.onboarding.findByUserId(userId);
  const user = await db.users.findById(userId);

  const timeToCompletion = progress.completedAt
    ? progress.completedAt.getTime() - user.createdAt.getTime()
    : null;

  const metrics: OnboardingMetrics = {
    userId,
    startDate: user.createdAt,
    timeToCompletion: timeToCompletion ? timeToCompletion / 1000 / 60 : undefined, // minutes
    stepsCompleted: progress.steps.filter(s => s.completed).length,
    totalSteps: progress.steps.length,
    conversionRate: progress.completionPercentage,
    churnRisk: !progress.completedAt && timeToCompletion > 7 * 24 * 60 * 60 * 1000
  };

  return metrics;
}
```

## Interactive Tours

```typescript
// Using shepherd.js
import Shepherd from 'shepherd.js';

function initializeProductTour() {
  const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      classes: 'shadow-md bg-white rounded-lg p-4'
    }
  });

  tour.addStep({
    id: 'welcome',
    title: 'Welcome!',
    text: 'Let\'s get you started with our platform',
    buttons: [
      { action: tour.next, text: 'Next' }
    ]
  });

  tour.addStep({
    id: 'dashboard',
    attachTo: { element: '.dashboard-nav', on: 'right' },
    title: 'Dashboard',
    text: 'View your overview and key metrics',
    buttons: [
      { action: tour.back, text: 'Back' },
      { action: tour.next, text: 'Next' }
    ]
  });

  tour.start();

  // Save progress
  tour.on('complete', () => {
    completeStep(userId, 'tour');
  });
}
```

## Email Onboarding

```typescript
// Drip email campaign
async function startOnboardingEmails(userId: string) {
  const user = await db.users.findById(userId);

  // Day 0: Welcome
  await emailService.send(user.email, 'welcome', {
    name: user.name,
    dashboardUrl: `https://app.example.com/dashboard`
  });

  // Day 1: Getting started
  setTimeout(() => {
    emailService.send(user.email, 'getting-started', {
      docsUrl: 'https://docs.example.com'
    });
  }, 24 * 60 * 60 * 1000);

  // Day 3: Explore features
  setTimeout(() => {
    emailService.send(user.email, 'explore-features');
  }, 3 * 24 * 60 * 60 * 1000);

  // Day 7: Re-engagement
  const progress = await db.onboarding.findByUserId(userId);
  if (progress.completionPercentage < 100) {
    setTimeout(() => {
      emailService.send(user.email, 're-engagement');
    }, 7 * 24 * 60 * 60 * 1000);
  }
}
```

## Best Practices

✅ **Keep it simple** - Minimum required steps
✅ **Progress visibility** - Show completion percentage
✅ **Optional tasks** - Don't require all steps
✅ **Contextual help** - Tips at right moments
✅ **Track metrics** - Monitor completion rates

## Resources

- [Onboarding Best Practices](https://www.useronboard.com/)
- [Shepherd.js](https://shepherdjs.dev/)
