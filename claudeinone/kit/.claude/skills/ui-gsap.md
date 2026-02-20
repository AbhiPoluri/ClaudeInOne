# GSAP Animations

## Overview
GSAP (GreenSock) is a professional-grade JavaScript animation library for high-performance, complex animations.

## Setup

```bash
npm install gsap
```

## Basic Tweens

```typescript
import { gsap } from 'gsap';

// Animate from current state
gsap.to('.box', { x: 200, duration: 1, ease: 'power2.out' });

// Animate from specified start
gsap.from('.box', { opacity: 0, y: 50, duration: 0.5 });

// Animate from to
gsap.fromTo('.box', { x: 0, opacity: 0 }, { x: 200, opacity: 1, duration: 1 });

// Multiple elements with stagger
gsap.from('.card', { opacity: 0, y: 30, stagger: 0.1, duration: 0.6 });
```

## Timeline

```typescript
const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.6 } });

tl.from('.hero-title', { opacity: 0, y: 40 })
  .from('.hero-subtitle', { opacity: 0, y: 20 }, '-=0.3')  // 0.3s overlap
  .from('.hero-cta', { opacity: 0, scale: 0.9 }, '-=0.2')
  .from('.hero-image', { opacity: 0, x: 50 }, '-=0.5');
```

## React with useGSAP

```bash
npm install @gsap/react
```

```tsx
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

gsap.registerPlugin(useGSAP);

export function AnimatedCard() {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(cardRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: 'power2.out',
    });
  }, { scope: cardRef });

  return <div ref={cardRef} className="card">Content</div>;
}
```

## ScrollTrigger

```bash
npm install gsap
```

```typescript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

gsap.from('.section-title', {
  scrollTrigger: {
    trigger: '.section-title',
    start: 'top 80%',
    end: 'top 50%',
    toggleActions: 'play none none reverse',
  },
  opacity: 0,
  y: 50,
  duration: 0.8,
});
```

## Best Practices
- Use `useGSAP()` in React for proper cleanup (prevents memory leaks)
- Register plugins once at app level: `gsap.registerPlugin(ScrollTrigger)`
- Use `gsap.context()` for scoped animations that clean up automatically
- Prefer CSS for simple transitions, GSAP for complex sequenced animations

## Resources
- [GSAP docs](https://gsap.com/docs/v3/)
- [GSAP React guide](https://gsap.com/resources/React/)
