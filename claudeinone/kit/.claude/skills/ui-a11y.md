# Accessibility (a11y)

## Overview
Build inclusive UIs that work for everyone — screen readers, keyboard users, and people with disabilities.

## Semantic HTML

```tsx
// BAD — div soup
<div onClick={handleClick}>Click me</div>
<div class="nav"><div>Home</div><div>About</div></div>

// GOOD — semantic elements
<button onClick={handleClick} type="button">Click me</button>
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>
```

## ARIA Roles and Labels

```tsx
// Modal
<div role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-desc">
  <h2 id="modal-title">Confirm Delete</h2>
  <p id="modal-desc">This action cannot be undone.</p>
  <button onClick={onClose} aria-label="Close dialog">✕</button>
</div>

// Loading state
<button disabled aria-busy={isLoading} aria-label={isLoading ? 'Saving...' : 'Save'}>
  {isLoading ? <Spinner /> : 'Save'}
</button>

// Form with error
<div>
  <label htmlFor="email">Email</label>
  <input
    id="email"
    type="email"
    aria-required="true"
    aria-invalid={!!error}
    aria-describedby={error ? 'email-error' : undefined}
  />
  {error && <p id="email-error" role="alert">{error}</p>}
</div>
```

## Keyboard Navigation

```tsx
// Trap focus in modal
import { useEffect, useRef } from 'react';

function Modal({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const focusable = el.querySelectorAll<HTMLElement>('button, [href], input, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    first?.focus();

    function handleTab(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
        e.preventDefault();
        (e.shiftKey ? last : first)?.focus();
      }
    }

    el.addEventListener('keydown', handleTab);
    return () => el.removeEventListener('keydown', handleTab);
  }, []);

  return <div ref={ref} role="dialog">{/* ... */}</div>;
}
```

## Color Contrast Check

```typescript
// Ensure 4.5:1 ratio for normal text, 3:1 for large text
// WCAG AA compliance
const colors = {
  textOnWhite: '#374151',   // 10.7:1 ✓
  primaryOnWhite: '#1d4ed8', // 6.8:1 ✓
  errorText: '#dc2626',      // 4.5:1 ✓
};
```

## Best Practices
- Test with keyboard only (Tab, Enter, Escape, Arrow keys)
- Test with VoiceOver (macOS) or NVDA (Windows)
- Run `npx axe-cli http://localhost:3000` for automated checks
- Add `aria-live="polite"` to dynamic content areas

## Resources
- [WCAG 2.1 guidelines](https://www.w3.org/TR/WCAG21/)
- [axe DevTools](https://www.deque.com/axe/)
