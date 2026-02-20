# User Onboarding

## Overview
Guide new users to their first value moment with checklists, product tours, and progressive disclosure.

## Onboarding Checklist Component

```tsx
interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  action?: { label: string; href: string };
}

export function OnboardingChecklist({ steps }: { steps: OnboardingStep[] }) {
  const completed = steps.filter(s => s.completed).length;
  const progress = (completed / steps.length) * 100;

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Get started ({completed}/{steps.length})</h3>
        <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>
      <ul className="space-y-3">
        {steps.map(step => (
          <li key={step.id} className="flex items-start gap-3">
            <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center
              ${step.completed ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
              {step.completed && <span className="text-white text-xs">✓</span>}
            </div>
            <div>
              <p className={`font-medium ${step.completed ? 'line-through text-gray-400' : ''}`}>{step.title}</p>
              {!step.completed && step.action && (
                <a href={step.action.href} className="text-sm text-blue-600 hover:underline">{step.action.label}</a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Track Onboarding Progress in DB

```typescript
// Track completion of each step
async function markStepComplete(userId: string, step: string) {
  await prisma.onboardingProgress.upsert({
    where: { userId_step: { userId, step } },
    create: { userId, step, completedAt: new Date() },
    update: { completedAt: new Date() },
  });
}

// Check if onboarding is complete
async function getOnboardingStatus(userId: string) {
  const REQUIRED_STEPS = ['profile_completed', 'first_project', 'team_invited'];
  const completed = await prisma.onboardingProgress.findMany({ where: { userId } });
  const completedSteps = new Set(completed.map(c => c.step));
  return {
    steps: REQUIRED_STEPS.map(step => ({ step, completed: completedSteps.has(step) })),
    isComplete: REQUIRED_STEPS.every(step => completedSteps.has(step)),
  };
}
```

## Send Activation Email Sequence

```typescript
// lib/onboarding.ts - trigger drip emails
async function handleUserSignup(user: User) {
  await sendWelcomeEmail(user);

  // Day 1: if not activated, send tips email
  await addToEmailQueue({ userId: user.id, template: 'activation-tips', delayMs: 24 * 60 * 60 * 1000 });
  // Day 3: check-in email
  await addToEmailQueue({ userId: user.id, template: 'day3-checkin', delayMs: 3 * 24 * 60 * 60 * 1000 });
}
```

## Best Practices
- Show checklist on dashboard (not in a modal that gets dismissed)
- Auto-detect and pre-complete steps when possible
- Define your activation event (e.g., "created first project") and optimize for it
- Remove the checklist once all steps are done

## Resources
- [Intercom onboarding](https://www.intercom.com/blog/onboarding-saas/)
